export class UserViewModel {
    id: string;
    login: string;
    email: string;
    createdAt: string;
}

export class PaginatorUserViewModel {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: UserViewModel[];
}