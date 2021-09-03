/*
UPDATES THE PROJECT STATUS BASED ON ORDER STATUS.
*/
// Status	Significado
// waiting_payment	Transação aguardando pagamento (status válido para Boleto bancário).
// processing	Transação está em processo de autorização.
// authorized	Transação foi autorizada. Cliente possui saldo na conta e este valor foi reservado para futura captura, que deve acontecer em até 5 dias para transações criadas com api_key. Caso não seja capturada, a autorização é cancelada automaticamente pelo banco emissor, e o status dela permanece como authorized.
// paid	Transação paga. Foi autorizada e capturada com sucesso. Para Boleto, significa que nossa API já identificou o pagamento de seu cliente.
// refunded	Transação estornada completamente.
// pending_refund	Transação do tipo Boleto e que está aguardando confirmação do estorno solicitado.
// refused	Transação recusada, não autorizada.
// chargedback	Transação sofreu chargeback. Veja mais sobre isso em nossa central de ajuda
// analyzing	Transação encaminhada para a análise manual feita por um especialista em prevenção a fraude.
// pending_review	Transação pendente de revisão manual por parte do lojista.Uma transação ficará com esse status por até 48 horas corridas.

export const formatOrderStatusByString = (
  order_status: string
): { pt: string; en: string } =>
  ({
    processing: {
      pt: 'Transação está em processo de autorização',
      en: 'processing'
    },
    authorized: { pt: 'Transação foi autorizada', en: 'authorized' },
    paid: { pt: 'Transação paga', en: 'paid' },
    refunded: {
      pt: 'Transação estornada completamente',
      en: 'refunded'
    },
    waiting_payment: {
      pt: 'Aguardando pagamento',
      en: 'waiting_payment'
    },
    pending_refund: {
      pt:
        'Transação do tipo Boleto,aguardando confirmação do estorno solicitado',
      en: 'pending_refund'
    },
    refused: {
      pt: 'Transação recusada, não autorizada',
      en: 'refused'
    },
    chargedback: {
      pt: 'Transação sofreu chargeback. Chargeback é uma contestação de compra',
      en: 'chargedback'
    },
    analyzing: {
      pt:
        'Transação encaminhada para a análise manual feita por um especialista em prevenção a fraude',
      en: 'analyzing'
    },
    pending_review: {
      pt:
        'Transação pendente de revisão manual por parte do lojista. Uma transação ficará com esse status por até 48 horas corridas',
      en: 'pending_review'
    }
  }[order_status] || { pt: 'Aguardando novo status', en: 'waiting' });
