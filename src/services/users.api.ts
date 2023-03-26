import { UserType } from '../types/users.type'

import http from '../utils/http'

export const getUsers = (page: number, results: number) => http.get<UserType>('api', { params: { page, results } })
