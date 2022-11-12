import {
	Alert,
	Avatar,
	Box,
	Card,
	CircularProgress,
	Container,
	InputAdornment, Link,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
	TablePagination,
	TextField,
	Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { useState } from 'react';
import useFindRepo from '../hooks/useFindRepo';
import formatDate from '../utils/formatDate';

const FindRepository = () => {
	const [inputValue, setInputValue] = useState('');
	const [inputError, setInputError] = useState(false);
	const RESULTS_PER_PAGE = 5;
	const [totalPageNumber, setTotalPageNumber] = useState(0);
	const [before, setBefore] = useState('');
	const [page, setPage] = useState(0);
	const [after, setAfter] = useState('');

	const [loadRepos, { loading, error, data, refetch }] = useFindRepo({
		fetchPolicy: 'network-only',
		notifyOnNetworkStatusChange: true,
		variables: {
			queryString: `${inputValue} sort:stars-desc,`,
			before: null,
			after: null,
			first: RESULTS_PER_PAGE,
			last: null,
		},
		onCompleted: (data) => {
			setTotalPageNumber(data.search.repositoryCount);
			setBefore(data.search.pageInfo.startCursor);
			setAfter(data.search.pageInfo.endCursor);
		},
	});

	const onSubmitHandler = (e: React.SyntheticEvent) => {
		e.preventDefault();
		if (!inputValue) return setInputError(true);
	};

	const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value.trim());
		inputValue && loadRepos();
		setInputError(false);
	};

	const handlePageChange = async (event: unknown, newPage: number) => {
		if (loading) return;
		setPage(newPage);
		if (newPage > page) {
			refetch({
				queryString: inputValue,
				before: null,
				after: after,
				first: RESULTS_PER_PAGE,
				last: null,
			});
		} else {
			refetch({
				queryString: inputValue,
				before: before,
				after: null,
				first: null,
				last: RESULTS_PER_PAGE,
			});
		}
	};

	return (
		<Container sx={{ margin: 'auto' }}>
			<form noValidate autoComplete="off" onSubmit={onSubmitHandler}>
				<Box sx={{ display: 'flex' }}>
					<TextField
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<SearchIcon />
								</InputAdornment>
							),
						}}
						fullWidth
						id="outlined-search"
						label="Search field"
						onChange={onChangeHandler}
						placeholder="Find a repository..."
						type="search"
						error={inputError}
					/>
				</Box>
			</form>
			{loading && <CircularProgress sx={{ margin: 'auto' }} />}
			{error && (
				<Alert
					sx={{
						margin: 'auto',
						width: '100%',
						display: 'flex',
						justifyContent: 'center',
					}}
					severity="error"
				>
					Something went wrong
				</Alert>
			)}
			{data && inputValue.trim() && (
				<>
					<Card>
						<List>
							{data.search.edges.map((repo) => (
								<ListItem
									key={repo.node.id}
									component={Link}
									href={repo.node.url}
									target="_blank"
								>
									<ListItemAvatar>
										<Avatar
											src={repo.node.owner.avatarUrl}
											alt={repo.node.owner.login}
										/>
									</ListItemAvatar>
									<ListItemText
										primary={repo.node.name}
										secondary={
											<Typography
												sx={{
													display: 'flex',
													alignItems: 'flex-end',
													gap: '0.5em',
												}}
											>
												<StarBorderIcon />
												<Typography
													sx={{
														mr: '1em',
													}}
													component="span"
													variant="body2"
													color="text.primary"
												>
													{repo.node.stargazers.totalCount} stars
												</Typography>
												{`Updated at ${formatDate(repo.node.updatedAt)}`}
											</Typography>
										}
									/>
								</ListItem>
							))}
						</List>
					</Card>
					<TablePagination
						rowsPerPageOptions={[]}
						component="div"
						count={totalPageNumber}
						page={page}
						onPageChange={handlePageChange}
						rowsPerPage={RESULTS_PER_PAGE}
					/>
				</>
			)}
		</Container>
	);
};

export default FindRepository;
