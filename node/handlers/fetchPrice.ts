import { NotFoundError } from '@vtex/api'

import type { Profile } from '../typings/profileSystem'

export async function fetchPrice(ctx: Context, next: Next) {
  const { clients, body } = ctx

  const { profileSystem, pricing } = clients

  const currentProfile = (await profileSystem.getProfileInfo(
    {
      email: body.item.email,
      //userId: body.context.email,
    },
    'priceTables'
  )) as Profile

  const price = await pricing.getPrice(
    body.item.skuId,
    currentProfile?.priceTables
  )

  if (!price) throw new NotFoundError('Price not found')

  ctx.state.quote = {
    ...price,
    skuId: body.item.skuId,
  }

  await next()
}
