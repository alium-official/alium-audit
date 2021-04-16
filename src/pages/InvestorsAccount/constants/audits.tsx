export type AuditType = {
  id: number
  headline: string
  date: string
}

const cardList = [
  {
    headline: 'Smart-Contract-Security-Audits',
    date: '29th March 2020'
  },
  {
    headline: 'Smart-Contract-Security-Audits',
    date: '29th March 2020'
  },
].map((item, i) => ({ ...item, id: i })) as Array<AuditType>

export default cardList
