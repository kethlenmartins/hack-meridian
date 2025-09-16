# Configuração do Supabase Storage S3

Este projeto usa o Supabase Storage com protocolo S3 para upload de arquivos. Siga as instruções abaixo para configurar corretamente.

## 1. Obter Credenciais S3 do Supabase

1. Acesse o [Dashboard do Supabase](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá para **Settings** > **Storage** > **S3**
4. Gere as credenciais S3 (Access Key ID e Secret Access Key)
5. Anote o endpoint e região

## 2. Configurar Variáveis de Ambiente

### Opção A: Arquivo .env (Recomendado)
```bash
# Supabase Storage S3 Configuration
SUPABASE_STORAGE_BUCKET=farmer-files
SUPABASE_STORAGE_ENDPOINT=https://wcquqbjrchhcnrspebpf.storage.supabase.co/storage/v1/s3
SUPABASE_STORAGE_REGION=sa-east-1
SUPABASE_STORAGE_ACCESS_KEY_ID=your_access_key_id
SUPABASE_STORAGE_SECRET_ACCESS_KEY=your_secret_access_key
```

### Opção B: Arquivo ~/.aws/credentials
```ini
[supabase]
aws_access_key_id = your_access_key_id
aws_secret_access_key = your_secret_access_key
endpoint_url = https://wcquqbjrchhcnrspebpf.storage.supabase.co/storage/v1/s3
region = sa-east-1
```

## 3. Estrutura de Arquivos no Bucket

```
farmer-files/
├── uploads/
│   └── [uuid].ext
├── farmers/
│   └── [farmerId]/
│       └── documents/
│           └── [farmerId]_[documentType]_[timestamp].ext
└── farms/
    └── [farmId]/
        └── photos/
            └── farm_[farmId]_[timestamp].ext
```

## 4. Endpoints Disponíveis

### Upload de Arquivos
- `POST /files/upload` - Upload genérico
- `POST /files/farmer/:farmerId/document` - Upload de documento do agricultor
- `POST /files/farm/:farmId/photo` - Upload de foto da fazenda

### Gerenciamento de Arquivos
- `GET /files/:path` - Obter URL do arquivo
- `DELETE /files/:path` - Excluir arquivo

## 5. Exemplo de Uso

```bash
# Upload de documento do agricultor
curl -X POST http://localhost:3001/files/farmer/123/document \
  -F "file=@certificate.pdf" \
  -F "documentType=certificate"

# Upload de foto da fazenda
curl -X POST http://localhost:3001/files/farm/456/photo \
  -F "file=@farm_photo.jpg"
```

## 6. Segurança

⚠️ **Importante**: As credenciais S3 fornecem acesso completo a todos os buckets e operações S3, ignorando políticas RLS. Use apenas no servidor e mantenha as credenciais seguras.

## 7. Documentação Oficial

- [Supabase Storage S3 Authentication](https://supabase.com/docs/guides/storage/s3/authentication)
- [AWS SDK for JavaScript](https://docs.aws.amazon.com/sdk-for-javascript/)
