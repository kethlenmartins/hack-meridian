# Hack-meridian
<div style="background-color: white; padding: 10px;">>
    <img src="assets/imagem_meridian.png" alt="Diagram"  width="400" style="display: block; margin: auto;" />
</div>

### Group
- Francisco Filho
- Kethlen Martins
- Caroline Paz
- Matheus Ribeiro
- Larissa Martins

**Languages / Idiomas:**
- [English](#english)
- [Português](#português)

## English
## 🌱 AgroFinance – Fair Credit for Family Farming

> We connect investors and family farmers through the Stellar blockchain, creating an accessible, transparent credit system with real social impact.

---

## 📌 The Problem

In Brazil, **over 70% of the food consumed comes from family farming**.  
Yet, thousands of small farmers remain excluded from the traditional financial system — with no access to fair credit, high interest rates, excessive bureaucracy, and low visibility.  
Banks charge **one of the highest interest rates in the world**, require collateral, and create bureaucratic barriers.  

This leaves family farmers without resources to invest, expand, and support their families.

---

## 🌟 Our Solution

We created a **web3 investment platform** that connects investors directly to family farmers verified by **CAF**.  

How it works:  
1. The investor invests an amount (e.g., R$100).  
2. **10%** becomes an immediate donation → direct support to the farmer + **Income Tax** deduction.  
3. **90%** goes into the credit fund:  
   - **80%** is lent to farmers at low interest rates with terms up to 2 years (1-year grace period).  
   - **20%** stays in reserve and administrative fees, ensuring security.  
4. The entire operation is recorded in **smart contracts** on **Stellar**, with fast, cheap, and transparent transactions.  

---

## 🚀 Key Advantages

- ✅ **Direct social impact** – strengthens family farmers.  
- ✅ **Tax benefit** – donation deductible on income tax.  
- ✅ **Fair financial return** – sustainable credit.  
- ✅ **Security** – reserves and transparent management.  
- ✅ **Stellar Blockchain** – instant and low-cost transactions.  

---

## 🏗️ Architecture & Stack

- **Frontend:** Next.js / React  
- **Backend:** Node.js + Supabase (PostgreSQL)  
- **Blockchain:** Stellar (smart contracts + XLM staking)  
- **Infrastructure:** Supabase Auth + Storage  

📊 Main database structure (Supabase):  
- `farmers` – farmers  
- `farms` – properties (identified by **CAF**)  
- `crops` – crops  
- `investors` – investors  
- `investments` – investments made  
- `files` – documents and certifications  

---

## ⚙️ How to Run the Project

```bash
# Clone the repository
git clone https://github.com/kethlenmartins/hack-meridian

# Go to the folder
cd HACK-MERIDIAN

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env

# Run the local server
npm run dev
```
### 🔮 Próximos Passos
- 📱 Mobile App – Android/iOS version for farmers.
- 📊 Investor Dashboard – display real-time social and financial impacts (e.g., families benefited, hectares cultivated, emissions avoided).
- 🤝 Partnerships with cooperatives and NGOs – verify farmers, reduce default rates, and increase local impact.

## Português
## 🌱 AgroFinance – Crédito Justo para Agricultura Familiar

> Unimos investidores e agricultores familiares por meio da blockchain Stellar, criando um sistema de crédito acessível, transparente e com impacto social real.

---

## 📌 O Problema

No Brasil, **mais de 70% dos alimentos consumidos vêm da agricultura familiar**.  
Mesmo assim, milhares de pequenos produtores permanecem excluídos do sistema financeiro tradicional — sem acesso a crédito justo, com juros altos, burocracia excessiva e pouca visibilidade.  
Os bancos cobram **uma das maiores taxas de juros do mundo**, exigem garantias e criam barreiras burocráticas.  

Isso deixa agricultores familiares sem acesso a recursos para investir, expandir e garantir o sustento de suas famílias.

---

## 🌟 Nossa Solução

Criamos uma **plataforma de investimento web3**, que conecta investidores diretamente a agricultores familiares verificados pelo **CAF**.  

Como funciona:  
1. O investidor aplica um valor (ex.: R$100).  
2. **10%** viram doação imediata → apoio direto ao agricultor + abatimento no **Imposto de Renda**.  
3. **90%** entram no fundo de crédito:  
   - **80%** vai para os agricultores com juros baixos e prazo de até 2 anos (1º ano de carência).  
   - **20%** ficam em reserva e taxas administrativas, garantindo segurança.  
4. Toda a operação é registrada em **smart contracts** na **Stellar**, com transações rápidas, baratas e transparentes.  

---

## 🚀 Diferenciais

- ✅ **Impacto social direto** – fortalece agricultores familiares.  
- ✅ **Benefício fiscal** – doação dedutível no IR.  
- ✅ **Retorno financeiro justo** – crédito sustentável.  
- ✅ **Segurança** – reservas e gestão transparente.  
- ✅ **Blockchain Stellar** – transações instantâneas e baratas.  

---

## 🏗️ Arquitetura & Stack

- **Frontend:** Next.js / React  
- **Backend:** Node.js + Supabase (PostgreSQL)  
- **Blockchain:** Stellar (smart contracts + XLM staking)  
- **Infra:** Supabase Auth + Storage  

📊 Estrutura principal do banco (Supabase):  
- `farmers` – agricultores  
- `farms` – propriedades (identificação pelo **CAF**)  
- `crops` – lavouras  
- `investors` – investidores  
- `investments` – investimentos realizados  
- `files` – documentos e certificações  

---

## ⚙️ Como rodar o projeto

```bash
# Clone o repositório
git clone https://github.com/kethlenmartins/hack-meridian

# Acesse a pasta
cd HACK-MERIDIAN

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env

# Rode o servidor local
npm run dev
```

### 🔮 Próximos Passos
- 📱 **App Mobile** – versão Android/iOS para agricultores.
- 📊 **Dashboard para investidores** – mostrar em tempo real os impactos sociais e financeiros (ex.: famílias beneficiadas, hectares cultivados, emissões evitadas).
- 🤝 **Parcerias com cooperativas e ONGs** – validar agricultores, reduzir inadimplência e ampliar impacto local.
