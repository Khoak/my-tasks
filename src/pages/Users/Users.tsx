import { useQuery } from '@tanstack/react-query'
import { getUsers } from '../../services/users.api'
import { useQueryString } from '../../utils/utils'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import { useEffect } from 'react'
import { BsFillArrowUpSquareFill, BsFillArrowDownSquareFill } from 'react-icons/bs'
import NotFound from '../NotFound/NotFound'
import LoadingUsers from '../../components/LoadingUsers/LoadingUsers'

import { useAppDispatch, useAppSelector } from '../../hooks/hooks'

import { updateUsers, sortFullName, sortUserName } from '../../features/users/usersSlice'

const RESULTS = 10
const TOTALPAGES = 10

const Users = () => {
  const dispatch = useAppDispatch()
  const users1 = useAppSelector((state) => state.users)

  const queryString: { page?: number } = useQueryString()
  const page = Number(queryString.page) || 1

  const { data, isLoading, error } = useQuery({
    queryKey: ['users', page],
    queryFn: () => getUsers(page, RESULTS),
    keepPreviousData: true,
    staleTime: 2 * 60 * 1000
  })

  const sortByFullName = () => {
    dispatch(sortFullName())
    const usersCopy = [...users1.users]
    usersCopy.sort((userA, userB): any => {
      const fullNameA = `${userA['name']['first']}${userA['name']['last']}`
      const fullNameB = `${userB['name']['first']}${userB['name']['last']}`
      if (users1.sort.sortReversed) {
        return fullNameB.localeCompare(fullNameA)
      }
      return fullNameA.localeCompare(fullNameB)
    })
    dispatch(updateUsers(usersCopy))
  }

  const sortByUserName = () => {
    dispatch(sortUserName())
    const usersCopy = [...users1.users]
    usersCopy.sort((userA, userB): any => {
      const fullNameA = `${userA['login']['username']}}`
      const fullNameB = `${userB['login']['username']}}`
      if (users1.sort.sortReversed) {
        return fullNameB.localeCompare(fullNameA, undefined, {
          numeric: true,
          sensitivity: 'base'
        })
      }
      return fullNameA.localeCompare(fullNameB, undefined, {
        numeric: true,
        sensitivity: 'base'
      })
    })
    dispatch(updateUsers(usersCopy))
  }

  const renderArrow = () => {
    if (users1.sort.sortReversed) {
      return <BsFillArrowUpSquareFill />
    }
    return <BsFillArrowDownSquareFill />
  }

  useEffect(() => {
    dispatch(updateUsers(data?.data['results']))
  }, [data?.data, dispatch])

  return (
    <>
      {isLoading && <LoadingUsers />}

      {!isLoading && error && <NotFound />}

      {!isLoading && !error && (
        <>
          <h1 className=' flex justify-center  mt-10 font-bold text-4xl text-red-400'>USERS</h1>
          <div className='mx-24 mt-14 overflow-x-auto shadow-md sm:rounded-lg'>
            <table className='w-full text-sm text-gray-500 '>
              <thead className='bg-gray-50 text-xs uppercase text-gray-700 '>
                <tr>
                  <th onClick={sortByFullName} scope='col' className='text-lg py-3 px-6'>
                    <div className='cursor-pointer flex justify-center align-center'>
                      <span className=' ml-10'>FullName</span>
                      <span className=' ml-10 mt-1.5'>
                        {users1.sort.sortField === 'fullname' ? renderArrow() : null}
                      </span>
                    </div>
                  </th>
                  <th onClick={sortByUserName} scope='col' className='text-lg py-3 px-6'>
                    <div className='cursor-pointer flex justify-center align-center'>
                      <span className=' ml-10'>UserName</span>
                      <span className=' ml-10 mt-1.5'>
                        {users1.sort.sortField === 'username' ? renderArrow() : null}
                      </span>
                    </div>
                  </th>
                  <th scope='col' className=' text-lg py-3 px-6'>
                    ThumbNail Icon
                  </th>
                </tr>
              </thead>
              <tbody>
                {users1?.users?.map((user: any) => (
                  <tr key={user.phone} className='border-b bg-white hover:bg-gray-50  '>
                    <th scope='row' className='whitespace-nowrap py-4 px-6 font-medium text-gray-900 '>
                      {`${user.name.title} ${user.name.first}${user.name.last}`}
                    </th>
                    <td className='py-4 px-6'>{user.login.username}</td>
                    <th className='py-4 px-6'>
                      <img src={user.picture.thumbnail} alt='avatar' className='h-10 w-10 object-top mx-auto' />
                    </th>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className='mt-10 mb-10 flex justify-center'>
            <nav>
              <ul className='inline-flex '>
                <li>
                  {page === 1 ? (
                    <span className='cursor-not-allowed rounded-l-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 '>
                      Previous
                    </span>
                  ) : (
                    <Link
                      to={`?page=${page - 1}`}
                      className=' rounded-l-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 '
                    >
                      Previous
                    </Link>
                  )}
                </li>

                {Array(TOTALPAGES)
                  .fill(0)
                  .map((_, index) => {
                    const pageNumber = index + 1
                    const isActive = page === pageNumber
                    return (
                      <li key={pageNumber}>
                        <Link
                          className={classNames(
                            'border border-gray-300  py-2 px-3 leading-tight  hover:bg-gray-100 hover:text-gray-700 ',
                            {
                              'bg-gray-100 text-gray-700 ': isActive,
                              'bg-white text-gray-500': !isActive
                            }
                          )}
                          to={`?page=${pageNumber}&results=${RESULTS}`}
                        >
                          {pageNumber}
                        </Link>
                      </li>
                    )
                  })}

                <li>
                  {page === TOTALPAGES ? (
                    <span className=' cursor-not-allowed rounded-r-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700'>
                      Next
                    </span>
                  ) : (
                    <Link
                      to={`?page=${page + 1}`}
                      className='rounded-r-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                    >
                      Next
                    </Link>
                  )}
                </li>
              </ul>
            </nav>
          </div>
        </>
      )}
    </>
  )
}

export default Users
