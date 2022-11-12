import { gql, QueryHookOptions, useLazyQuery } from '@apollo/client';

interface Repo {
	node: {
		id: string;
		stargazers: {
			totalCount: number;
		};
		name: string;
		updatedAt: string;
		owner: {
			avatarUrl: string;
			login: string;
		};
	};
}

interface SearchedReposData {
	search: {
		repositoryCount: number;
		pageInfo: {
			startCursor: string;
			endCursor: string;
		};
		edges: Repo[];
	};
}

const GET_SEARCHED_REPOS = gql`
	query SearchRepository(
		$queryString: String!
		$first: Int
		$last: Int
		$before: String
		$after: String
	) {
		search(
			query: $queryString
			type: REPOSITORY
			first: $first
			last: $last
			before: $before
			after: $after
		) {
			repositoryCount
			pageInfo {
				startCursor
				endCursor
			}
			edges {
				node {
					... on Repository {
						id
						stargazers {
							totalCount
						}
						name
						updatedAt
						owner {
							avatarUrl
							login
						}
					}
				}
			}
		}
	}
`;
export default function useFindRepo(options: QueryHookOptions) {
	return useLazyQuery<SearchedReposData>(GET_SEARCHED_REPOS, options);
}
