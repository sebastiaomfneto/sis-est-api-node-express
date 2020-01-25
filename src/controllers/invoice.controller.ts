import { Request, Response, NextFunction } from 'express';
import { Route, Authentication } from '../lib';
import { NotFoundError } from '../lib/errors';
import { Invoice, Entry, Parameter } from '../models';

export class InvoiceController {
  invoice: Invoice;

  @Route.Param('invoiceId')
  @Authentication.Authenticate()
  async findById(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const invoice: Invoice | null = await Invoice.findByPk(req.params.invoiceId);

    if (!invoice) {
      throw new NotFoundError();
    }

    this.invoice = invoice;

    next();
  }

  @Route.Get('/invoices')
  @Authentication.Authenticate()
  async index(_req: Request, res: Response): Promise<void> {
    const invoices: Invoice[] = await Invoice.findAll();

    res.json(invoices);
  }

  @Route.Get('/invoices/:invoiceId')
  @Authentication.Authenticate()
  async find(_req: Request, res: Response): Promise<void> {
    res.json(this.invoice.toJSON());
  }

  @Route.Post('/invoices')
  @Authentication.Authenticate()
  async create(req: Request, res: Response): Promise<void> {
    const parameter: Parameter | null = await Parameter.findOne();
    const entry: Entry | null = await Entry.findByPk(req.body.entryId);

    if (!parameter) {
      throw new Error('Paramters not found');
    }

    if (!entry) {
      throw new NotFoundError('Entry not found');
    }

    req.body.totalValue = Invoice.getTotalValue(entry.initialDate, entry.finalDate, parameter.valuePerHour)

    const invoice: Invoice = await Invoice.create(req.body);

    res.status(201).json(invoice.toJSON());
  }

  @Route.Delete('/invoices/:invoiceId')
  @Authentication.Authenticate()
  async remove(_req: Request, res: Response): Promise<void> {
    await this.invoice.destroy();

    res.status(204).json();
  }
}
