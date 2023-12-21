"use client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login.jsx";
import Background from "./components/background.jsx";

export default function Home() {
	return (
		<main
			style={{
				padding: "0",
				margin: "0",
			}}>
			<Background />
			<Router>
				<Routes>
					<Route path="/" element={<Login />}></Route>
				</Routes>
			</Router>
		</main>
	);
}
