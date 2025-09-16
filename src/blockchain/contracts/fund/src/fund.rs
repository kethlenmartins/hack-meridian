#![no_std]
use soroban_sdk::{
    contract, contractimpl, testutils::Address as AddressTestUtils,
    vec, Address, Env, Symbol, IntoVal,
};

use crate::{FundContract, FundContractClient, FundState, STATE_KEY};

#[contract]
pub struct DummyRouter;

#[contractimpl]
impl DummyRouter {
    pub fn swap_exact_tokens_for_tokens(
        env: Env,
        _token_in: Address,
        amount_in: i128,
        _token_out: Address,
        _to: Address,
    ) {
        env.events().publish(
            (Symbol::new(&env, "mock_swap"),),
            amount_in,
        );
    }
}

#[contract]
pub struct DummyToken;

#[contractimpl]
impl DummyToken {
    pub fn transfer(_env: Env, _from: Address, _to: Address, _amount: i128) {}
}

#[contract]
pub struct DummyComet;

#[contractimpl]
impl DummyComet {
    pub fn supply(_env: Env, _token: Address, _amount: i128) {}
    pub fn withdraw(_env: Env, _token: Address, _amount: i128) {}
}

// Função de setup sem o oráculo
fn setup() -> (Env, Address, Address, Address, Address, Address) {
    let env = Env::default();
    env.mock_all_auths(); 

    let router_id = env.register_contract(None, DummyRouter);
    let comet_id = env.register_contract(None, DummyComet);
    let usdc_id = env.register_contract(None, DummyToken);
    let xlm_id = env.register_contract(None, DummyToken);
    let fund_id = env.register_contract(None, FundContract);

    let client = FundContractClient::new(&env, &fund_id);
    client.init(&router_id, &comet_id, &usdc_id, &xlm_id);

    (env, fund_id, router_id, comet_id, usdc_id, xlm_id)
}

fn set_senior_balance(env: &Env, fund_id: &Address, new_balance: i128) {
    env.as_contract(fund_id, || {
        let mut state: FundState = env.storage()
            .persistent()
            .get(&STATE_KEY)
            .unwrap_or_else(|| panic!("Contract not initialized"));
        
        state.total_senior = new_balance;

        env.storage()
            .persistent()
            .set(&STATE_KEY, &state);
    });
}

// Testes para as funcionalidades do contrato

#[test]
fn test_init_fund() {
    let (env, fund_id, _, _, _, _) = setup();
    let client = FundContractClient::new(&env, &fund_id);

    let state: FundState = client.get_state();

    assert_eq!(state.total_senior, 0);
    assert_eq!(state.total_subordinated, 0);
    assert_eq!(state.total_fund, 0);
    assert_eq!(state.shares.len(), 0);
}

#[test]
fn test_invest_fund() {
    let (env, fund_id, _, _, _, _) = setup();
    let client = FundContractClient::new(&env, &fund_id);

    let investor = Address::generate(&env);
    let amount_usdc = 1000_i128;

    client.invest(&investor, &amount_usdc);

    let state: FundState = client.get_state();

    let invested = state.shares.get(investor.clone()).unwrap_or_default();
    assert_eq!(invested, amount_usdc);

    assert_eq!(state.total_senior, 820);
    assert_eq!(state.total_subordinated, 150);
    assert_eq!(state.total_fund, 30);
}

#[test]
fn test_donate() {
    let (env, fund_id, _, _, _, _) = setup();
    let client = FundContractClient::new(&env, &fund_id);

    let donor = Address::generate(&env);
    let amount_usdc = 1000;

    client.donate(&donor, &amount_usdc);

    let state = client.get_state();

    assert_eq!(state.total_fund, amount_usdc);
    assert_eq!(state.shares.contains_key(donor), false);
}

#[test]
fn test_multiple_investments() {
    let (env, fund_id, _, _, _, _) = setup();
    let client = FundContractClient::new(&env, &fund_id);

    let investor1 = Address::generate(&env);
    let investor2 = Address::generate(&env);
    let amount1 = 1000_i128;
    let amount2 = 500_i128;

    client.invest(&investor1, &amount1);
    client.invest(&investor2, &amount2);

    let state: FundState = client.get_state();

    assert_eq!(state.shares.get(investor1.clone()).unwrap_or_default(), amount1);
    assert_eq!(state.shares.get(investor2.clone()).unwrap_or_default(), amount2);

    let total_invested = amount1 + amount2;
    assert_eq!(state.total_senior, total_invested * 82 / 100);
    assert_eq!(state.total_subordinated, total_invested * 15 / 100);
    assert_eq!(state.total_fund, total_invested * 3 / 100);
}

#[test]
fn test_invest_same_investor_multiple_times() {
    let (env, fund_id, _, _, _, _) = setup();
    let client = FundContractClient::new(&env, &fund_id);

    let investor = Address::generate(&env);
    let amount1 = 1000_i128;
    let amount2 = 500_i128;

    client.invest(&investor, &amount1);
    client.invest(&investor, &amount2);

    let state: FundState = client.get_state();

    let total_investor = amount1 + amount2;
    assert_eq!(state.shares.get(investor).unwrap_or_default(), total_investor);

    assert_eq!(state.total_senior, total_investor * 82 / 100);
    assert_eq!(state.total_subordinated, total_investor * 15 / 100);
    assert_eq!(state.total_fund, total_investor * 3 / 100);
}

#[test]
fn test_unstake_subordinated_sufficient_balance() {
    let (env, fund_id, _, _, _, _) = setup();
    let client = FundContractClient::new(&env, &fund_id);

    let investor = Address::generate(&env);
    client.invest(&investor, &1000_i128);

    let recipient = Address::generate(&env);
    let unstake_amount = 100_i128;

    client.unstake_subordinated(&unstake_amount, &recipient);

    let state = client.get_state();
    assert_eq!(state.total_subordinated, 150);
}

#[test]
#[should_panic]
fn test_unstake_subordinated_insufficient_balance() {
    let (env, fund_id, _, _, _, _) = setup();
    let client = FundContractClient::new(&env, &fund_id);

    let recipient = Address::generate(&env);
    let unstake_amount = 1000_i128;

    client.unstake_subordinated(&unstake_amount, &recipient);
}

#[test]
#[should_panic]
fn test_redeem_empty_investment() {
    let (env, fund_id, _, _, _, _) = setup();
    let client = FundContractClient::new(&env, &fund_id);

    let investor = Address::generate(&env);
    
    client.redeem_investment(&investor, &0_i128);
}

#[test]
fn test_redeem_investment_success() {
    let (env, fund_id, _, _, _, _) = setup();
    let client = FundContractClient::new(&env, &fund_id);

    let investor = Address::generate(&env);
    let investment_amount = 1000_i128;

    client.invest(&investor, &investment_amount);

    let state_before_redeem = client.get_state();

    let subordinated_part = investment_amount * 15 / 100;
    let yield_amount = subordinated_part * 10 / 100; 

    let total_payment = investment_amount + yield_amount;

    let new_senior_balance = total_payment + 100;
    set_senior_balance(&env, &fund_id, new_senior_balance);
    
    let state_updated = client.get_state();

    client.redeem_investment(&investor, &yield_amount);

    let state_after = client.get_state();
    
    assert_eq!(state_after.shares.get(investor).unwrap_or_default(), 0);
    assert_eq!(state_after.total_senior, state_updated.total_senior - total_payment);
}

#[test]
#[should_panic]
fn test_redeem_insufficient_senior_balance() {
    let (env, fund_id, _, _, _, _) = setup();
    let client = FundContractClient::new(&env, &fund_id);

    let investor = Address::generate(&env);
    let investment_amount = 1000_i128;

    client.invest(&investor, &investment_amount);

    let mut state = client.get_state();
    state.total_senior = investment_amount - 1; 
    env.storage().persistent().set(&STATE_KEY, &state);

    client.redeem_investment(&investor, &0_i128);
}

#[test]
fn test_investment_calculations_100() {
    let (env, fund_id, _, _, _, _) = setup();
    let client = FundContractClient::new(&env, &fund_id);
    let investor = Address::generate(&env);
    let amount = 100_i128;
    
    client.invest(&investor, &amount);
    let state = client.get_state();

    assert_eq!(state.total_senior, 82);
    assert_eq!(state.total_subordinated, 15);
    assert_eq!(state.total_fund, 3);
    assert_eq!(state.total_senior + state.total_subordinated + state.total_fund, amount);
}

#[test]
fn test_investment_calculations_1000() {
    let (env, fund_id, _, _, _, _) = setup();
    let client = FundContractClient::new(&env, &fund_id);
    let investor = Address::generate(&env);
    let amount = 1000_i128;
    
    client.invest(&investor, &amount);
    let state = client.get_state();

    assert_eq!(state.total_senior, 820);
    assert_eq!(state.total_subordinated, 150);
    assert_eq!(state.total_fund, 30);
    assert_eq!(state.total_senior + state.total_subordinated + state.total_fund, amount);
}

#[test]
fn test_investment_calculations_5500() {
    let (env, fund_id, _, _, _, _) = setup();
    let client = FundContractClient::new(&env, &fund_id);
    let investor = Address::generate(&env);
    let amount = 5500_i128;
    
    client.invest(&investor, &amount);
    let state = client.get_state();

    assert_eq!(state.total_senior, 4510);
    assert_eq!(state.total_subordinated, 825);
    assert_eq!(state.total_fund, 165);
    assert_eq!(state.total_senior + state.total_subordinated + state.total_fund, amount);
}

#[test]
fn test_investment_calculations_10000() {
    let (env, fund_id, _, _, _, _) = setup();
    let client = FundContractClient::new(&env, &fund_id);
    let investor = Address::generate(&env);
    let amount = 10000_i128;
    
    client.invest(&investor, &amount);
    let state = client.get_state();

    assert_eq!(state.total_senior, 8200);
    assert_eq!(state.total_subordinated, 1500);
    assert_eq!(state.total_fund, 300);
    assert_eq!(state.total_senior + state.total_subordinated + state.total_fund, amount);
}