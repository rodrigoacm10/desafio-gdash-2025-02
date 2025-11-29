export const formatDate = (data: string) =>
  new Date(data).toLocaleString('pt-BR')
// new Date(data).toLocaleString('en-US')

// const formatDate = (iso: string) => {
//   const d = new Date(iso)
//   return d.toLocaleDateString('pt-BR', {
//     day: '2-digit',
//     month: '2-digit',
//     year: 'numeric',
//   })
// }
