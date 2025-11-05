import Board from '../_components/boards/preview/board'

const CasenamePage = async ({ params }: { params: { casename: string } }) => {
  return <Board params={params} />
}

export default CasenamePage
