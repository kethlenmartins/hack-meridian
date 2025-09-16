-- Tabela para armazenar notificações
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_email VARCHAR(255) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'email',
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    sent_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    
    -- Índices para melhor performance
    CONSTRAINT notifications_type_check CHECK (type IN ('email')),
    CONSTRAINT notifications_status_check CHECK (status IN ('pending', 'sent', 'failed'))
);

-- Índices para otimizar consultas
CREATE INDEX IF NOT EXISTS idx_notifications_recipient_email ON notifications(recipient_email);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON notifications(status);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);

-- RLS (Row Level Security) - opcional, descomente se necessário
-- ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Política de exemplo para RLS (descomente se necessário)
-- CREATE POLICY "Users can view their own notifications" ON notifications
--     FOR SELECT USING (recipient_email = current_setting('request.jwt.claims', true)::json->>'email');

-- CREATE POLICY "Users can insert their own notifications" ON notifications
--     FOR INSERT WITH CHECK (recipient_email = current_setting('request.jwt.claims', true)::json->>'email');
