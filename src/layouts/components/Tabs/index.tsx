/* eslint-disable simple-import-sort/imports */
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { HomeFilled } from "@ant-design/icons";
import { message, Tabs } from "antd";

import type { AppDispatch, RootState } from "@/rtk";
import { setTabsList } from "@/rtk";
import { useAppDispatch, useAppSelector } from "@/hooks/useRTK";
import { HOME_URL } from "@/config/config";
import { routerArray } from "@/routers";
import { searchRoute } from "@/utils/util";
import MoreButton from "./components/MoreButton";

import "./index.less";

const LayoutTabs = () => {
	const dispatch: AppDispatch = useAppDispatch();
	const global = useAppSelector((state: RootState) => state.global);
	const tabs = useAppSelector((state: RootState) => state.tabs);
	const { tabsList } = tabs;
	const { themeConfig } = global;
	const { TabPane } = Tabs;
	const { pathname } = useLocation();
	const navigate = useNavigate();
	const [activeValue, setActiveValue] = useState<string>(pathname);

	useEffect(() => {
		addTabs();
	}, [pathname]);

	// click tabs
	const clickTabs = (path: string) => {
		navigate(path);
	};

	// add tabs
	const addTabs = () => {
		const route = searchRoute(pathname, routerArray);
		let newTabsList = JSON.parse(JSON.stringify(tabsList));
		if (tabsList.every((item: any) => item.path !== route.path)) {
			newTabsList.push({ title: route.meta!.title, path: route.path });
		}
		dispatch(setTabsList(newTabsList));
		setActiveValue(pathname);
	};

	// delete tabs
	const delTabs = (tabPath?: string) => {
		if (tabPath === HOME_URL) return;
		if (pathname === tabPath) {
			tabsList.forEach((item: Menu.MenuOptions, index: number) => {
				if (item.path !== pathname) return;
				const nextTab = tabsList[index + 1] || tabsList[index - 1];
				if (!nextTab) return;
				navigate(nextTab.path);
			});
		}
		message.success("你删除了Tabs标签 😆😆😆");
		dispatch(setTabsList(tabsList.filter((item: Menu.MenuOptions) => item.path !== tabPath)));
	};

	const setTabs = (list: Menu.MenuOptions[]) => {
		dispatch(setTabsList(list));
	};

	return (
		<>
			{!themeConfig.tabs && (
				<div className="tabs">
					<Tabs
						animated
						activeKey={activeValue}
						onChange={clickTabs}
						hideAdd
						type="editable-card"
						onEdit={path => {
							delTabs(path as string);
						}}
					>
						{tabsList.map((item: Menu.MenuOptions) => {
							return (
								<TabPane
									key={item.path}
									tab={
										<span>
											{item.path == HOME_URL ? <HomeFilled /> : ""}
											{item.title}
										</span>
									}
									closable={item.path !== HOME_URL}
								></TabPane>
							);
						})}
					</Tabs>
					<MoreButton tabsList={tabsList} delTabs={delTabs} setTabsList={setTabs}></MoreButton>
				</div>
			)}
		</>
	);
};

export default LayoutTabs;
