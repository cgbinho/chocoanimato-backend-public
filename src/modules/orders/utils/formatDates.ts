import storageConfig from '@config/storage';
import { addMilliseconds, format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

/*
FORMAT CREATE DATE TO STRING
*/
export async function formatCreateDateString(data: any): Promise<string> {
  const date = new Date(data);

  return format(date, "dd'/'MM'/'yy', às 'HH:mm'hs'", {
    locale: ptBR
  });
}

export function formatCreateDate(data: any): string {
  return format(data, "dd'/'MM'/'yy', às 'HH:mm'hs'", {
    locale: ptBR
  });
}

/*
FORMAT DOWNLOAD EXPIRE DATE TO STRING
*/
export async function formatDownloadExpireDateString(
  data: string
): Promise<string> {
  const date = new Date(data);
  /*
  ADD EXPIRE DAYS TO DATE
  */
  const expireDateParsed = addMilliseconds(
    date,
    storageConfig.delivery.expiresIn
  );
  return format(expireDateParsed, "dd'/'MM'/'yy', às 'HH:mm'hs'", {
    locale: ptBR
  });
}
