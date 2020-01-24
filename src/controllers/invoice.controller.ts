import { Route, Request, Authentication } from '../lib';
import { NotFoundError, BadRequestError } from '../lib/errors';

import { Invoice, Entry, Parameter } from '../models';

export class InvoiceController {
  invoice: Invoice;

  @Route.Param('invoiceId')
  @Authentication.Authenticate()
  async findById(invoiceId: string): Promise<void> {
    const invoice: Invoice | null = await Invoice.findByPk(invoiceId);

    if (!invoice) {
      throw new NotFoundError();
    }

    this.invoice = invoice;
  }

  @Route.Get('/invoices')
  @Authentication.Authenticate()
  async index(): Promise<Invoice[]> {
    return await Invoice.findAll();
  }

  @Route.Get('/invoices/:invoiceId')
  @Authentication.Authenticate()
  async find(): Promise<Invoice> {
    return this.invoice;
  }

  @Route.Post('/invoices')
  @Authentication.Authenticate()
  async create(@Request.Body() body: Partial<Invoice>): Promise<Invoice> {
    const parameter: Parameter | null = await Parameter.findOne();
    const entry: Entry | null = await Entry.findByPk(body.entryId);

    if (!parameter) {
      throw new Error('Paramters not found');
    }

    if (!entry) {
      throw new NotFoundError('Entry not found');
    }

    try {
      const invoice: Invoice = await Invoice.build(body);

      invoice.totalValue = Invoice.getTotalValue(entry.initialDate, entry.finalDate, parameter.valuePerHour)

      return await invoice.save();
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  @Route.Delete('/invoices/:invoiceId')
  @Authentication.Authenticate()
  async remove(): Promise<void> {
    await this.invoice.destroy();
  }
}
