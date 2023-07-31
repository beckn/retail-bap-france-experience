import { Config } from './../../types/Setup';
import * as sa from 'superagent';
import { quoteParam } from '../../types/Quote';
import { AckResponse } from '../../types/BecknClientApi';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default async function getQuote(
  context: { config: Config; client: sa.SuperAgent<sa.SuperAgentRequest> },
  params: quoteParam,
  token: string
): Promise<AckResponse> {
  const config = context.config as Config;
  const client = context.client as sa.SuperAgent<sa.SuperAgentRequest>;

  return client
    .post(
      'https://api-node.mobilityreferencebap.becknprotocol.io/client/v2/get_quote'
    )
    .set({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    })
    .send(params)
    .then((res) => {
      return res.body as AckResponse;
    });
}
