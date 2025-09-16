#![no_std]
use soroban_sdk::{
    contract, contractimpl, testutils::{Address as AddressTestUtils, MockAuth}, vec,
    Address, Env, Symbol, IntoVal
};

use crate::{
    DataKey, LoanType, PaymentContract, PaymentContractClient, Loan, LoanRequest, ContractAddresses
};

#[contract]
pub struct DummyRouter;

#[contractimpl]
impl DummyRouter {
    pub fn swap_exact_tokens_for_tokens(
        _env: Env,
        _token_in: Address,
        _amount_in: i128,
        _token_out: Address,
        _to: Address,
    ) {}
}

#[contract]
pub struct DummyToken;

#[contractimpl]
impl DummyToken {
    pub fn transfer(_env: Env, _from: Address, _to: Address, _amount: i128) {}
    pub fn approve(_env: Env, _from: Address, _spender: Address, _amount: i128, _expiration_ledger: u32) {}
}

#[contract]
pub struct DummyComet;

#[contractimpl]
impl DummyComet {
    pub fn supply(_env: Env, _token: Address, _amount: i128) {}
    pub fn withdraw(_env: Env, _token: Address, _amount: i128) {}
}

pub fn setup() -> (Env, PaymentContractClient<'static>) {
    let env = Env::default();
    env.mock_all_auths(); 

    let router_id = env.register_contract(None, DummyRouter);
    let comet_id = env.register_contract(None, DummyComet);
    let usdc_id = env.register_contract(None, DummyToken);
    let payment_contract_id = env.register_contract(None, PaymentContract);

    let client = PaymentContractClient::new(&env, &payment_contract_id);
    client.init(&router_id, &comet_id, &usdc_id);

    env.as_contract(&usdc_id, || {
        let addresses = ContractAddresses {
            soroswap_router: router_id,
            blend_comet: comet_id,
            usdc_token: usdc_id.clone(),
        };
        env.storage().persistent().set(&DataKey::Addresses, &addresses);
    });

    (env, client)
}

#[test]
fn test_accept_credit_with_discount() {
    let (env, client) = setup();
    let farmer = Address::generate(&env);
    let amount = 10000;
    let interest_rate = 5;
    let loan_fee = 2;
    let term_in_months = 12;

    client.request_credit(&farmer, &amount, &interest_rate, &loan_fee);

    client.accept_credit(&farmer, &term_in_months);

    let loan: Loan = client.get_loan(&farmer);
    let loan_request: LoanRequest = client.get_loan_request(&farmer);

    let expected_discount = amount * 10 / 100;
    let expected_discounted_amount = amount - expected_discount;
    let expected_total_principal = expected_discounted_amount + (expected_discounted_amount * loan_fee / 100);

    assert_eq!(loan.principal, expected_total_principal);
    assert_eq!(loan_request.approved, true);
    assert_eq!(loan.term_in_months, term_in_months);
}

#[test]
fn test_pay_installment() {
    let (env, client) = setup();
    let farmer = Address::generate(&env);
    let amount = 10000;
    let interest_rate = 5;
    let loan_fee = 2;
    let term_in_months = 12;

    client.request_credit(&farmer, &amount, &interest_rate, &loan_fee);

    client.accept_credit(&farmer, &term_in_months);

    let payment_amount = 1000;
    
    client.pay_installment(&farmer, &payment_amount);

    let loan: Loan = client.get_loan(&farmer); 
    assert_eq!(loan.paid_principal, payment_amount);
}


#[test]
fn test_pay_off_loan_successfully() {
    let (env, client) = setup();
    let farmer = Address::generate(&env);
    let amount = 10000;
    let interest_rate = 5;
    let loan_fee = 2;
    let term_in_months = 12;

    client.request_credit(&farmer, &amount, &interest_rate, &loan_fee);
    client.accept_credit(&farmer, &term_in_months);

    let paid_amount = client.pay_off_loan(&farmer);

    assert_eq!(paid_amount, 9180);

    let result = client.try_get_loan(&farmer);

    assert!(result.is_err());
}

#[test]
#[should_panic]
fn test_pay_off_non_existent_loan() {
    let (env, client) = setup();
    let farmer = Address::generate(&env);
    
    client.pay_off_loan(&farmer);
}