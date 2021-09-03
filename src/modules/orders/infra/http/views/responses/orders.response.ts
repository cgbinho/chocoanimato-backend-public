import { formatOrderStatusByString } from '@modules/orders/utils/formatOrderStatus';

export default {
  render(order) {
    return getOrder(order);
  },
  created(order) {
    return getOrderCreated(order);
  },
  index(data) {
    const { results, page_total, total } = data;

    const orders = results.map(order => getOrders(order));

    return { results: orders, page_total, total };
  }
};

/*
LISTS ALL ORDERS WITH STATUS IN PT-BR.
*/
function getOrders(order) {
  const status = formatOrderStatusByString(order.status);

  return {
    id: order.id,
    transaction_id: order.transaction_id,
    status,
    created_at: order.created_at,
    updated_at: order.updated_at
  };
}

/*
LIST A SINGLE ORDER WITH ITEM DETAILS (PROJECTS).
*/
function getOrder({ order, projects }) {
  // List projects:
  const projectsData = projects.map(project => ({
    id: project.id,
    name: project.name,
    description: project.template.description,
    category: project.template.category,
    ratio: project.template.ratio,
    duration: project.template.duration
    // price: project.template.price
  }));

  // status in english: 'pending'
  const status = formatOrderStatusByString(order.status);

  return {
    id: order.id,
    reference_id: order.reference_id,
    transaction_id: order.transaction_id,
    payment_method: order.payment_method,
    boleto: order.boleto,
    project_ids: order.project_ids,
    gross_amount: order.gross_amount,
    discount_amount: order.discount_amount,
    net_amount: order.net_amount,
    installment_count: order.installment_count,
    status,
    created_at: order.created_at,
    updated_at: order.updated_at,
    projects: projectsData
  };
}

/*
LIST THE ORDER CREATED.
*/
function getOrderCreated({ order, transaction, projects }) {
  // List projects:
  const projectsData = projects.map(project => ({
    id: project.id,
    name: project.name,
    description: project.template.description,
    category: project.template.category,
    ratio: project.template.ratio,
    duration: project.template.duration
    // price: project.template.price
  }));

  // status in english: 'pending'
  const status = formatOrderStatusByString(order.status);

  return {
    id: order.id,
    reference_id: order.reference_id,
    transaction_id: order.transaction_id,
    payment_method: order.payment_method,
    boleto: order.boleto,
    project_ids: order.project_ids,
    gross_amount: order.gross_amount,
    discount_amount: order.discount_amount,
    net_amount: order.net_amount,
    installment_count: order.installment_count,
    status,
    created_at: order.created_at,
    updated_at: order.updated_at,
    projects: projectsData
  };
}

// {
//   "id": "6dcd798c-44bb-475c-b30b-d6ee89bed7d0",
//   "reference_id": "CHOCO-e355e773-90f0-46d1-b7df-a71d56dae01e",
//   "transaction_id": 11571390,
//   "payment_method": "BOLETO",
//   "boleto": {
//     "boleto_url": "http://localhost/boleto",
//     "boleto_barcode": "01234567890",
//     "boleto_expiration_date": "12/12/2021"
//   },
//   "project_ids": [
//     "3e729990-0570-4fa4-9da7-15aba253c0a8"
//   ],
//   "gross_amount": 10000,
//   "discount_amount": 0,
//   "net_amount": 10000,
//   "installment_count": 1,
//   "status": {
//     "pt": "Aguardando pagamento",
//     "en": "waiting_payment"
//   },
//   "created_at": "2021-03-09T17:29:16.400Z",
//   "updated_at": "2021-03-09T17:29:16.400Z",
//   "projects": [
//     {
//       "id": "3e729990-0570-4fa4-9da7-15aba253c0a8",
//       "name": "Projeto Teste",
//       "description": "Descrição do template atualizado",
//       "category": [
//         "video-explicativo"
//       ],
//       "ratio": "16:9",
//       "duration": 60
//     }
//   ]
// }
