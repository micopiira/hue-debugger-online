const archetypeAliases = {
	sultanbulb: 'BulbsSultan',
	huelightstrip: 'HeroesLightstrip'
};

export function resolveIcon(light) {
	if (light.type === 'On/Off plug-in unit') {
		return 'DevicesPlug';
	}
	return archetypeAliases[light.config.archetype];
}
