import React, { useEffect, useMemo, useState } from 'react'

export default function Dashboard() {
    const [users, setUsers] = useState([])
    const [searchItem, setSearchItem] = useState()
    const [page, setPage] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const limit = 30
    let totalPages = 0
    const [totalPagesArr, setTotalPagesArr] = useState([])
    const [show, setShow] = useState(null)


    const fetchUsers = async (e) => {
        try {
            setIsLoading(true)
            const skip = (page - 1) * limit
            const response = await fetch(e?.target?.value ? `https://dummyjson.com/users/search?q=${e?.target?.value}&skip=${skip}&limit=${limit}` : `https://dummyjson.com/users?skip=${page}&limit=${limit}`)
            const data = await response.json();
            // console.log(data)
            if (data.users) {
                setIsLoading(false)
                setUsers(data.users)
                totalPages = Math.ceil(data?.total / limit)
                setTotalPagesArr(Array(totalPages).fill("Hello"))
                // console.log(totalPagesArray)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [page])

    const debounce = (func) => {
        let timerId
        return (...argu) => {
            clearTimeout(timerId)
            timerId = setTimeout(() => func(...argu), 400)
        }
    }

    const debounceCallApi = useMemo(() => debounce(fetchUsers), [])

    const handleInputChange = async (e) => {
        const searchTerm = e.target.value;
        setSearchItem(searchTerm)
        debounceCallApi(e)
    }

    function dateFormat(date) {
        if (date) {
            let formattedDate = date.split("-")
            return `${formattedDate[2]}-${formattedDate[1] < 10 ? "0" + formattedDate[1] : formattedDate[1]}-${formattedDate[0]}`
        }
        return
    }

    return (
        <div className='main' id='main'>
            <div className="section" id='section'>
                <div className="card">
                    <div className="card-header bg-warning">
                        <h2 className="card-title text-center">List Of Users</h2>
                        <div className='float-end'>
                            <input className="form-control" placeholder="Search..." type="search" name="search" title="Search within table" value={searchItem} onChange={handleInputChange} />
                        </div>
                    </div>
                    <div className="card-body">
                        {
                            !users?.length ?
                                // Spinner Start
                                <div className='text-center mb-3'>
                                    <div class="spinner-border" role="status">
                                        <span class="sr-only">Loading...</span>
                                    </div>
                                </div>
                                // Spinner End
                                :
                                // User Table Start
                                <table className='table'>
                                    <thead>
                                        <tr>
                                            <th>Sr No.</th>
                                            <th>Name</th>
                                            <th>Details</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            users?.map((user, i) => {
                                                return (
                                                    <tr key={i}>
                                                        <td>{i + 1 + (page - 1) * limit}</td>
                                                        <td>{user.firstName + " " + user.lastName}</td>
                                                        <td ><i className="fa-solid fa-eye ms-3 detail-hover" onClick={() => setShow(i)}></i></td>
                                                        {/* User Detail Card Start */}
                                                        {i === show && <div className="overlay-modal"  >
                                                            <div className="modal-modal">
                                                                <div className="card">
                                                                    <div className="card-header d-flex justify-content-between">
                                                                        <h4>User Details</h4>
                                                                        <button className='btn btn-outline-secondary' onClick={() => setShow(null)} >X</button>
                                                                    </div>
                                                                    <div className="card-body">
                                                                        <div className="row">
                                                                            <div className='col-6 white-space '>
                                                                                <p><strong>Name : </strong> {user.firstName + " " + user.lastName}</p>
                                                                            </div>
                                                                            <div className='col-6 white-space'>
                                                                                <p><strong>Email : </strong> {user.email}</p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="row">
                                                                            <div className='col-6 white-space '>
                                                                                <p><strong>Mobile : </strong> {user.phone}</p>
                                                                            </div>
                                                                            <div className='col-6 white-space'>
                                                                                <p><strong>Date Of Birth : </strong> {dateFormat(user.birthDate)}</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>}
                                                        {/* User Detail Card End */}
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            // User Table End
                        }
                        {/* Pagination Start */}
                        <div className='d-flex justify-content-end'>
                            <nav aria-label="Page navigation example">
                                <ul className="pagination">
                                    <li className={`page-item ${page === 1 ? "disabled" : ""}`} disabled ><a className="page-link" href="#" onClick={() => setPage(page - 1)} >Previous</a></li>
                                    {

                                        !isLoading && totalPagesArr.map((_, i) => {
                                            return (
                                                <li className="page-item" key={i}><a className={`page-link ${page === i + 1 ? " pagination-button" : ""}`} href="#" onClick={() => setPage(i + 1)}>{i + 1}</a></li>
                                            )
                                        })
                                    }
                                    <li className={`page-item ${page === totalPagesArr.length ? "disabled" : ""}`}><a className="page-link" href="#" onClick={() => setPage(page + 1)}>Next</a></li>
                                </ul>
                            </nav>
                        </div>
                        {/* Pagination End */}
                    </div>
                </div>
            </div>
        </div>
    )
}
