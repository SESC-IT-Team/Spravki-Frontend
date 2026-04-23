export default function AdminPage() {
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
									<th></th>
									<th>Дата</th>
									<th>Учащийся</th>
									<th>Класс</th>
									<th>Справка</th>
									<th>Ссылка</th>
								</tr>
							</thead>
							<tbody>
								{/* row 1 */}
								<tr>
									<th>1</th>
									<td>2</td>
									<td>3</td>
									<td>4</td>
									<td>5</td>
									<td>6</td>
								</tr>
							</tbody>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}