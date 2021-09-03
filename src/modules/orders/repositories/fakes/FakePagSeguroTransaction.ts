// MOCKED TRANSACTION FOR SANDBOX

const currentStatus = (status: number): { pt: string; en: string } =>
  ({
    1: { pt: 'Aguardando Pagamento', en: 'pending' },
    2: { pt: 'Em Análise', en: 'in_analysis' },
    3: { pt: 'Paga', en: 'paid' },
    4: { pt: 'Disponível', en: 'available' },
    5: { pt: 'Em Disputa', en: 'in_dispute' },
    6: { pt: 'Devolvida', en: 'returned' },
    7: { pt: 'Cancelada', en: 'cancelled' }
  }[status] || { pt: 'Aguardando Pagamento', en: 'pending' });

const FakePagSeguroTransaction = {
  code: '1C5BFD84-C721-4140-A65A-EE24CD79EAEC',
  reference_id: 'REF-7ff29d33-954b-4e30-a839-3367b74492e0',
  status: currentStatus(3)
};

/*
1	Aguardando pagamento: o comprador iniciou a transação, mas até o momento o PagSeguro não recebeu nenhuma informação sobre o pagamento.
2	Em análise: o comprador optou por pagar com um cartão de crédito e o PagSeguro está analisando o risco da transação.
3	Paga: a transação foi paga pelo comprador e o PagSeguro já recebeu uma confirmação da instituição financeira responsável pelo processamento.
4	Disponível: a transação foi paga e chegou ao final de seu prazo de liberação sem ter sido retornada e sem que haja nenhuma disputa aberta.
5	Em disputa: o comprador, dentro do prazo de liberação da transação, abriu uma disputa.
6	Devolvida: o valor da transação foi devolvido para o comprador.
7	Cancelada: a transação foi cancelada sem ter sido finalizada.
*/

// const FakePagSeguroTransaction = {
//   date: '2020-05-15T08:00:58.000-03:00',
//   code: '1C5BFD84-C721-4140-A65A-EE24CD79EAEC',
//   reference: 'REF-7ff29d33-954b-4e30-a839-3367b74492e0',
//   type: 1,
//   status: 3,
//   lastEventDate: '2020-05-15T08:01:02.000-03:00',
//   paymentMethod: { type: 2, code: 202 },
//   paymentLink:
//     'https://sandbox.pagseguro.uol.com.br/checkout/payment/booklet/print.jhtml?c=16ea9ba4b2d351838b7a961c51d898ef594f680ed8392e9379c69745c922e20dd908446a0d89a7d8',
//   grossAmount: 100000,
//   discountAmount: 1000,
//   creditorFees: {
//     intermediationRateAmount: 0.4,
//     intermediationFeeAmount: 3.59
//   },
//   netAmount: 90000,
//   extraAmount: -1000,
//   installmentCount: 1,
//   itemCount: 1,
//   items: {
//     item: {
//       id: 'b00d1400-c8e5-4333-92bc-aa5f65986ff4',
//       description: 'Projeto 001',
//       quantity: 1,
//       amount: 10000
//     }
//   },
//   sender: {
//     name: 'José Comprador',
//     email: 'c30802180609252104444@sandbox.pagseguro.com.br',
//     phone: { areaCode: 99, number: 4398560 },
//     documents: {
//       document: { type: 'CPF', value: 1234567890 }
//     }
//   },
//   primaryReceiver: {
//     publicKey: 'PUB9D41C6B432CC4E4FB6596A6067F72517'
//   }
// };

export default FakePagSeguroTransaction;
