#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, Address, Env, Symbol, vec, IntoVal
};


#[derive(Clone)]
#[contracttype]
pub struct LoanRequest {
    pub farmer: Address,
    pub amount: i128,
    pub interest_rate: i128,
    pub loan_fee: i128,
    pub approved: bool,
}

#[derive(Clone)]
#[contracttype]
pub struct Loan {
    pub farmer: Address,
    pub principal: i128,
    pub interest_rate: i128,
    pub total_interest_paid: i128,
    pub paid_principal: i128,
    pub term_in_months: u32,
    pub start_date: u64,
}

#[contracttype]
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum DataKey {
    Addresses,
}

#[contracttype]
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum LoanType {
    Request,
    Loan,
}


#[derive(Clone)]
#[contracttype]
pub struct ContractAddresses {
    pub soroswap_router: Address,
    pub blend_comet: Address,
    pub usdc_token: Address,
}

#[contract]
pub struct PaymentContract;

#[contractimpl]
impl PaymentContract {
    pub fn init(env: Env, router: Address, comet: Address, usdc: Address) {
        let addresses = ContractAddresses {
            soroswap_router: router,
            blend_comet: comet,
            usdc_token: usdc,
        };
        env.storage().persistent().set(&DataKey::Addresses, &addresses);
    }

    pub fn request_credit(env: Env, farmer: Address, amount: i128, interest_rate: i128, loan_fee: i128) {
        farmer.require_auth();

        let req = LoanRequest {
            farmer: farmer.clone(),
            amount,
            interest_rate,
            loan_fee,
            approved: false,
        };
        
        env.storage().persistent().set(&(LoanType::Request, farmer), &req);
    }

    pub fn accept_credit(env: Env, farmer: Address, term_in_months: u32) {
        let mut req: LoanRequest = env.storage().persistent().get(&(LoanType::Request, farmer.clone())).unwrap();

        if req.approved {
            panic!("Crédito já aprovado");
        }
        
        let discount = req.amount * 10 / 100;
        let discounted_amount = req.amount - discount;

        let total_principal = discounted_amount + (discounted_amount * req.loan_fee / 100);

        let loan = Loan {
            farmer: req.farmer.clone(),
            principal: total_principal,
            interest_rate: req.interest_rate,
            total_interest_paid: 0,
            paid_principal: 0,
            term_in_months,
            start_date: env.ledger().timestamp(),
        };

        env.storage().persistent().set(&(LoanType::Loan, farmer.clone()), &loan);

        req.approved = true;
        env.storage().persistent().set(&(LoanType::Request, farmer.clone()), &req);

        let addresses: ContractAddresses = env.storage().persistent().get(&DataKey::Addresses).unwrap();

        env.invoke_contract::<()>(
            &addresses.usdc_token,
            &Symbol::new(&env, "transfer"),
            vec![
                &env,
                env.current_contract_address().into_val(&env),
                farmer.into_val(&env),
                discounted_amount.into_val(&env),
            ],
        );
    }

    pub fn pay_installment(env: Env, farmer: Address, amount: i128) {
        farmer.require_auth();
        
        let mut loan: Loan = env.storage().persistent().get(&(LoanType::Loan, farmer.clone())).unwrap();

        loan.paid_principal += amount;

        let addresses: ContractAddresses = env.storage().persistent().get(&DataKey::Addresses).unwrap();
        
        let remaining_principal = loan.principal - loan.paid_principal;
        let installment_interest = remaining_principal * loan.interest_rate / 100;
        
        loan.total_interest_paid += installment_interest;

        if loan.paid_principal >= loan.principal {
            env.storage().persistent().remove(&(LoanType::Loan, farmer.clone()));
        } else {
            env.storage().persistent().set(&(LoanType::Loan, farmer), &loan);
        }

        env.invoke_contract::<()>(
            &addresses.blend_comet,
            &Symbol::new(&env, "supply"),
            vec![
                &env,
                addresses.usdc_token.into_val(&env),
                installment_interest.into_val(&env),
            ],
        );
    }

    pub fn pay_off_loan(env: Env, farmer: Address) -> i128 {
        farmer.require_auth();

        let loan: Loan = env.storage().persistent().get(&(LoanType::Loan, farmer.clone())).unwrap();

        let addresses: ContractAddresses = env.storage().persistent().get(&DataKey::Addresses).unwrap();

        let time_passed = env.ledger().timestamp() - loan.start_date;
        let months_passed = (time_passed / 2592000) as u32;

        let amount_due = (loan.principal - loan.paid_principal) + (loan.total_interest_paid);

        env.storage().persistent().remove(&(LoanType::Loan, farmer.clone()));

        env.invoke_contract::<()>(
            &addresses.usdc_token,
            &Symbol::new(&env, "transfer"),
            vec![
                &env,
                farmer.into_val(&env),
                env.current_contract_address().into_val(&env),
                amount_due.into_val(&env),
            ],
        );

        amount_due
    }
    
    pub fn get_loan_request(env: Env, farmer: Address) -> LoanRequest {
        env.storage().persistent().get(&(LoanType::Request, farmer)).unwrap()
    }

    pub fn get_loan(env: Env, farmer: Address) -> Loan {
        env.storage().persistent().get(&(LoanType::Loan, farmer)).unwrap()
    }
}
