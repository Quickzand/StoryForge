"use client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login.jsx";

export default function Home() {
	return (
		<main
			style={{
				background: "#FFF",
				height: "100vh",
				padding: "0",
				margin: "0",
			}}>
			<Router>
				<Routes>
					<Route path="/" element={<Login />}></Route>
				</Routes>
			</Router>
		</main>
	);
}
