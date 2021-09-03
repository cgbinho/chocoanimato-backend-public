import PDFDocument from 'pdfkit';
import getStream from 'get-stream';

import AppError from '@shared/errors/AppError';

import IPdfProvider from '../models/IPdfProvider';
import { formatMoney } from '@modules/orders/utils/formatNumbers';

import { ICreateReceiptDTO } from '../dtos/ICreateReceiptDTO';
import ICreateProjectDTO from '@modules/projects/dtos/ICreateProjectDTO';

export default class PdfkitProvider implements IPdfProvider {
  public async createReceipt(data: ICreateReceiptDTO): Promise<string> {
    const { projects, order, payment } = data;
    /*
    CREATE A LIST OF ALL ORDER PROJECTS
    */
    const projectList = projects.map(
      (project: ICreateProjectDTO) =>
        `Vídeo: ${project.name} \nDescrição: ${
          project.template.description
        } \nDuração: ${project.template.duration} | Proporção: ${
          project.template.ratio
        } \nValor: R$${formatMoney(project.template.price)}\n`
    );

    /* PDF TEXT SETTINGS */
    const text_settings = {
      paragraphGap: 5,
      lineGap: 0.5
    };

    /*
    CREATE PDF STREAM
    */
    try {
      const pdf = async () => {
        const doc = new PDFDocument();

        // Titulo
        doc.text(
          `
Choco Animato - Recibo de compra
        `,
          {
            align: 'justify',
            ...text_settings
          }
        );
        // Dados do Pedido
        doc.text(
          `Código do Pedido: ${order.reference_id}
Realizado em ${payment.order_create_date}
Status: Download disponível por até 7 dias.
`,
          text_settings
        );

        // Dados do comprador
        doc.text(
          `
Dados do Comprador
`,
          text_settings
        );
        doc.text(
          `Nome: ${order.user.name}
Email: ${order.user.email}`,
          text_settings
        );
        // Resumo do pedido
        doc.text(
          `
Resumo do pedido
        `,
          text_settings
        );
        doc.text(projectList.join(''), text_settings);
        // Resumo do pedido
        doc.text(
          `
Dados de Cobrança
          `,
          text_settings
        );
        doc.text(
          `Método de Pagamento: ${payment.payment_method}
Subtotal: ${payment.gross_amount}
Desconto: ${payment.discount_amount}
Total: ${payment.net_amount}
Num. de Parcelas: ${payment.installment_count}
        `,
          text_settings
        );
        // add svg with doc.path('path values').stroke()
        // Add an image, constrain it to a given size, and center it vertically and horizontally
        // doc.image("path/to/image.png", {
        //   fit: [250, 300],
        //   align: "center",
        //   valign: "center"
        // });
        doc.end();
        return await getStream.buffer(doc);
      };

      // Caller could do this:
      const pdfBuffer = await pdf();
      const pdfBase64string = pdfBuffer.toString('base64');
      return pdfBase64string;
    } catch (error) {
      return null;
    }
  }
}
