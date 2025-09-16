#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, Address, Env, Symbol, Map, vec, 
    String, symbol_short, IntoVal,
};

const ADDRS_KEY: Symbol = symbol_short!("ADDRS");
const STATE_KEY: Symbol = symbol_short!("STATE");


#[derive(Clone)]
#[contracttype]
pub struct ContractAddresses {
    pub soroswap_router: Address,
    pub blend_comet: Address,
    pub usdc_token: Address,
    pub xlm_token: Address,
}

#[derive(Clone)]
#[contracttype]
pub struct FundState {
    pub shares: Map<Address, i128>, 
    pub total_senior: i128,         
    pub total_subordinated: i128,   
    pub total_fund: i128,           
}

#[contract]
pub struct FundContract;

#[contractimpl]
impl FundContract {

    pub fn init(env: Env, router: Address, comet: Address, usdc: Address, xlm: Address) {

        env.storage().persistent().set(
            &ADDRS_KEY,
            &ContractAddresses {
                soroswap_router: router,
                blend_comet: comet,
                usdc_token: usdc,
                xlm_token: xlm,
            },
        );

        let state = FundState {
            shares: Map::new(&env),
            total_senior: 0,
            total_subordinated: 0,
            total_fund: 0,
        };
        env.storage().persistent().set(&STATE_KEY, &state);
    }

    pub fn invest(env: Env, investor: Address, amount_usdc: i128) {
        let mut state: FundState = env.storage().persistent()
            .get(&STATE_KEY)
            .unwrap_or_else(|| panic!("Contract not initialized"));

        let addrs: ContractAddresses = env.storage().persistent()
            .get(&ADDRS_KEY)
            .unwrap_or_else(|| panic!("Addresses not set"));

        let senior_part = amount_usdc * 82 / 100;
        let xlm_part = amount_usdc * 15 / 100;
        let fund_part = amount_usdc * 3 / 100;

        state.total_senior += senior_part;
        state.total_subordinated += xlm_part;
        state.total_fund += fund_part;

        let invested = state.shares.get(investor.clone()).unwrap_or(0);
        state.shares.set(investor.clone(), invested + amount_usdc);

        env.storage().persistent().set(&STATE_KEY, &state);

        env.invoke_contract::<()>(
            &addrs.soroswap_router,
            &Symbol::new(&env, "swap_exact_tokens_for_tokens"),
            vec![
                &env,
                addrs.usdc_token.into_val(&env),
                senior_part.into_val(&env),
                addrs.xlm_token.into_val(&env),
                investor.clone().into_val(&env),
            ],
        );        

        env.invoke_contract::<()>(
            &addrs.blend_comet,
            &Symbol::new(&env, "supply"),
            vec![
                &env, 
                addrs.xlm_token.into_val(&env), 
                xlm_part.into_val(&env)
            ],
        );
    }

    pub fn donate(env: Env, donor: Address, amount_usdc: i128) {
        donor.require_auth();

        let mut state: FundState = env.storage().persistent()
            .get(&STATE_KEY)
            .unwrap_or_else(|| panic!("Contract not initialized"));
        
        state.total_fund += amount_usdc;

        env.storage().persistent().set(&STATE_KEY, &state);

        let addrs: ContractAddresses = env.storage().persistent()
            .get(&ADDRS_KEY)
            .unwrap_or_else(|| panic!("Addresses not set"));
        

        env.invoke_contract::<()>(
            &addrs.usdc_token,
            &Symbol::new(&env, "transfer"),
            vec![
                &env,
                donor.clone().into_val(&env),
                env.current_contract_address().into_val(&env),
                amount_usdc.into_val(&env),
            ],
        );
    }

    pub fn unstake_subordinated(env: Env, amount: i128, _recipient: Address) {
        let state: FundState = env.storage().persistent()
            .get(&STATE_KEY)
            .unwrap_or_else(|| panic!("Contract not initialized"));

        if state.total_subordinated < amount {
            panic!("Saldo insuficiente para unstake");
        }

        let addrs: ContractAddresses = env.storage().persistent()
            .get(&ADDRS_KEY)
            .unwrap_or_else(|| panic!("Addresses not set"));

        env.invoke_contract::<()>(
            &addrs.blend_comet,
            &Symbol::new(&env, "withdraw"),
            vec![
                &env,
                addrs.xlm_token.into_val(&env), 
                amount.into_val(&env)
            ],
        );
    }

    pub fn redeem_investment(env: Env, investor: Address, stake_yield: i128) {
        let mut state: FundState = env.storage().persistent()
            .get(&STATE_KEY)
            .unwrap_or_else(|| panic!("Contract not initialized"));
    
        let invested_amount = state.shares.get(investor.clone()).unwrap_or(0);
        if invested_amount == 0 {
            panic!("Investidor não possui saldo");
        }
    
        let total_payment = invested_amount + stake_yield;
    
        if state.total_senior < total_payment {
            panic!("Saldo insuficiente na cota sênior para pagamento");
        }
        state.total_senior -= total_payment; 
    
        state.shares.set(investor.clone(), 0);
        env.storage().persistent().set(&STATE_KEY, &state);
    
        let addrs: ContractAddresses = env.storage().persistent()
            .get(&ADDRS_KEY)
            .unwrap_or_else(|| panic!("Addresses not set"));
    
        env.invoke_contract::<()>(
            &addrs.usdc_token,
            &Symbol::new(&env, "transfer"),
            vec![
                &env,
                env.current_contract_address().into_val(&env),
                investor.into_val(&env),
                total_payment.into_val(&env), 
            ],
        );
    }

    pub fn get_state(env: Env) -> FundState {
        env.storage().persistent()
            .get(&STATE_KEY)
            .unwrap_or_else(|| panic!("Contract not initialized"))
    }
}
