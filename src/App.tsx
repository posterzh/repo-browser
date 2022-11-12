import React from 'react';
import './App.css';
import {Box, createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import FindRepository from "./pages/FindRepository";

const theme = createTheme({
	palette: {
    primary: {
      main: '#0052cc',
    },
    secondary: {
      main: '#edf2ff',
    },
  },
});

function App() {
  return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Box sx={{ margin: 5 }}>
				<FindRepository />
			</Box>
		</ThemeProvider>
	);
}

export default App;
