import React, {useContext} from 'react';
import BulbIcon from '../BulbIcon';
import Nav from "../layout/Nav";
import ApiContext from "../ApiContext";
import LightListItem from "../LightListItem";
import LoadingListItem from "../LoadingListItem";
import {LightsContext} from "../LightsContext";
import {resolveIcon} from "../../lightIconResolver";
import ThemeContext from "../ThemeContext";
import CustomSwitch from "../bootstrap/CustomSwitch";
import {Link} from "react-router-dom";
import { Sun, Moon, Settings } from "react-feather";

function LightList() {
	const {api} = useContext(ApiContext);
	const {lights, groups, refetch} = useContext(LightsContext);

	const setLightState = (lightId, newState) => {
		api.setLightState({lightId, newState})
			.then(() => refetch())
			.catch(error => {
				console.error(error);
				alert(error);
			});
	};

	return (
		<>
			<Nav title="Hue online">
				<Sun size={18}/>
				<ThemeContext.Consumer>
					{({isDark, setDark}) => <CustomSwitch id="themeToggler" checked={isDark} onChange={event => setDark(event.target.checked)}/>}
				</ThemeContext.Consumer>
				<Moon size={20}/>
				<Link to="/settings" style={{color: 'inherit', lineHeight: 1}} className="ml-2"><Settings size={20}/></Link>
			</Nav>
			<div className="container">
				{Object.values(groups).filter(group => group.type === 'Room' || group.type === 'Zone').filter(group => group.lights.length > 0).map(group =>
					<React.Fragment key={group.name}>
						<div className="row no-gutters">
							<strong className="text-muted text-uppercase p-1">{group.name}</strong>
						</div>
						<div className="row no-gutters row-cols-1 row-cols-md-2">
							{group.lights.map(lightId => {
								const light = lights[lightId];
								return <div className="col d-flex p-1" key={light.uniqueid}>
									<React.Suspense fallback={<LoadingListItem/>}>
										<LightListItem light={light}
												   lightId={lightId}
												   setLightState={newState => setLightState(lightId, newState)}
												   stretchedLink={`/${lightId}`}
												   icon={<BulbIcon width="1.5rem" height="1.5rem" icon={resolveIcon(light)}/>}/>
									</React.Suspense>
								</div>;
							})}
						</div>
					</React.Fragment>
				)}
			</div>
		</>
	);
}

export default LightList;
