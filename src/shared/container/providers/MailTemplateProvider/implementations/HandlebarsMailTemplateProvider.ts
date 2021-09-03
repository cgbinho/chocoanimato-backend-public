import handlebars from 'handlebars';
import fs from 'fs';
import { injectable } from 'tsyringe';

import IParseMailTemplateDTO from '../dtos/IParseMailTemplateDTO';
import IMailTemplateProvider from '../models/IMailTemplateProvider';

@injectable()
export default class HandlebarsMailTemplateProvider
  implements IMailTemplateProvider {
  public async parse({
    file,
    variables
  }: IParseMailTemplateDTO): Promise<string> {
    const templateFileContent = await fs.promises.readFile(file, {
      encoding: 'utf-8'
    });

    handlebars.registerHelper('switch', function (name, value, options) {
      this['_switch_value_' + name] = value;
      this['_switch_break_' + name] = false;
      var html = options.fn(this);
      delete this['_switch_break_' + name];
      delete this['_switch_value_' + name];
      return html;
    });
    handlebars.registerHelper('case', function (name, value, options) {
      var args = Array.prototype.slice.call(arguments);
      var options = args.pop();
      var caseValues = args;

      if (
        this['_switch_break_' + name] ||
        caseValues.indexOf(this['_switch_value_' + name]) === -1
      ) {
        return '';
      } else {
        this['_switch_break_' + name] = true;
        return options.fn(this);
      }
    });
    handlebars.registerHelper('default', function (name, options) {
      if (!this['_switch_break_' + name]) {
        return options.fn(this);
      }
    });
    handlebars.registerHelper('if_eq', function (a, b, opts) {
      if (a == b)
        // Or === depending on your needs
        return opts.fn(this);
      else return opts.inverse(this);
    });

    const parseTemplate = handlebars.compile(templateFileContent);

    return parseTemplate(variables);
  }
}

/*
Handlebars.registerHelper("switch", function(value, options) {
    this._switch_value_ = value;
    var html = options.fn(this); // Process the body of the switch block
    delete this._switch_value_;
    return html;
});

Handlebars.registerHelper("case", function(value, options) {
    if (value == this._switch_value_) {
        return options.fn(this);
    }
});
*/
