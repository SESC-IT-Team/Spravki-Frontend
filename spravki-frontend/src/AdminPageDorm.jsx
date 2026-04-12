const requestedData = [
	{id:2, date:"23.02 15:44",student:"Иван Петренко", leaving:"26.02 05:00", returning: "28.02 23:00"},
	{id:1, date:"24.02 14:00",student:"Петр Иванов", leaving:"28.02 15:30", returning: "30.03 23:00"}
]

export default function AdminPageDorm() {
  return (
    <div className="min-h-screen bg-base-200 px-4 py-8 sm:px-6">
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-4 text-center">
          <h1 className="text-3xl font-bold text-base-content sm:text-4xl">Заказ справок</h1>
        </div>
				<div className="card border border-primary/20 bg-base-100 shadow-xl">
					<div className="card-body">
						<div className="table">
							{/* head */}
							<thead>
								<tr>
									<th>id</th>
									<th>Подано</th>
									<th>Учащийся</th>
									<th>Выход</th>
									<th>Возвращение</th>
								</tr>
							</thead>
							<tbody>
								{requestedData.map((req) => (
								<tr key = "id">
									<th>
										<a className = "link"> {req.id} </a>
									</th>
									<td>{req.date}</td>
									<td>{req.student}</td>
									<td>{req.leaving}</td>
									<td>{req.returning}</td>
								</tr>
									))}
							</tbody>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}