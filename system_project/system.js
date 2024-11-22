class planet{
    constructor(name, origin, maxX, maxY, start, mass, radius, semi_major_axis, perihelion, aphelion, orbital_period, rotation_period, axial_tilt, temperature, surface_gravity, composition, moons, sub_moons){
        this.name = name;
        this.mass = mass;
        this.radius = radius;
        this.semi_major_axis = semi_major_axis;
        this.perihelion = perihelion;
        this.aphelion = aphelion;
        this.orbital_period = orbital_period;
        this.rotation_period = rotation_period;
        this.axial_tilt = axial_tilt;
        this.temperature = temperature;
        this.surface_gravity = surface_gravity;
        this.composition = composition;
        this.moons = moons;
        this.sub_moons = sub_moons;
        this.origin = origin;
        this.maxX = maxX;
        this.maxY = maxY;
        this.start = start;
        this.position = start;
    }

    get real_position(){
        let realPositionX = this.origin[0] + this.position[0];
        let realPositionY = this.origin[1] - this.position[1];
        return [realPositionX, realPositionY];
    }
}

function read_planet_data(planet_data_json){
    let planets = [];
    let planets_data = JSON.parse(planet_data_json);
    planets_data = planets_data.objects;
    let planet_names = ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto', 'Eris'];
    // Origins represents the starting position of the planets, repective to their max x values. Y values always start positive, determined by x value.
    let origins =      [       -1,     .75,     -.5,     .2,        .3,      -.5,        0,        .8,     -.9,    -.2];
    let screen_width = window.innerWidth;
    let screen_height = window.innerHeight;
    width_padding = .025*screen_width;
    height_padding = .025*screen_height;
    n = 0
    for(let i = 0; i < planet_names.length; i++){
        let planet_name = planet_names[i];
        let planet_data = planets_data[planet_name];
        let name = planet_names[i];
        //origin represents the center of the ellipse that the planet will orbit around
        let originX = screen_width/2
        let originY = screen_height/2 + (n*(height_padding))
        let origin = [originX, originY];
        //maxX represents the maximum width of the ellipse that the planet will orbit around
        let maxX = screen_width/2 - ((n+1)*width_padding);
        let maxY = screen_height/2 - ((n+1)*height_padding);
        //find the starting position of the planet
        let startX = origins[i]*maxX;
        // startY is defined by the equation of an ellipse, always the positive value
        let startY = (maxY*((maxX**2-startX**2)**.5))/maxX;
        let start = [startX,startY];
        let mass = planet_data.mass;
        let radius = planet_data.equatorial_radius;
        let semi_major_axis = planet_data.orbital_distance;
        let perihelion = planet_data.perihelion;
        let aphelion = planet_data.aphelion;
        let orbital_period = planet_data.orbital_period;
        let rotation_period = planet_data.rotationary_period;
        let axial_tilt = planet_data.axis_of_rotation;
        let temperature = planet_data.temperature;
        let surface_gravity = planet_data.gravity;
        let composition = planet_data.composition;
        let moons = planet_data.number_of_moons;
        let sub_moons = 0;
        planets.push(new planet(name, origin, maxX, maxY, start, mass, radius, semi_major_axis, perihelion, aphelion, orbital_period, rotation_period, axial_tilt, temperature, surface_gravity, composition, moons, sub_moons));
    }
    return planets;
}

function add_planets_to_html(planets){
    console.log('Adding planets to html');
    console.log(planets);
    let planet_div = document.getElementById('planets');
    for(let i = 0; i < planets.length; i++){
        let planet = planets[i];
        let real_position = planet.real_position;
        let planet_html = '<div class="planet container" id="' + planet.name + '" style="position:absolute; left:' + real_position[0] + 'px; top:' + real_position[1] +'px;">';
                planet_html += '<div class="row">';
                    // planet_html += '<canvas id="canvas" width="' + planet.maxX + '" height="' + planet.maxY + '" style="position:absolute; left:' + real_position[0] + 'px; top:' + real_position[1] + 'px;"></canvas>';
                    planet_html += '<div class="planet_model col-sm">';
                        // planet_html += '<img src="https://t4.ftcdn.net/jpg/10/18/11/31/360_F_1018113113_Ce9kjo5sLSpeQE4OqI3g2Khc9gp6ZzJ6.jpg"' + planet.name + '.png" alt="' + planet.name + '">';
                        planet_html += '<model-viewer alt="Eris" src="assets/3d/eris.glb" ar environment-image="assets/3d/moon_1k.hdr" poster="" shadow-intensity="1" camera-controls touch-action="pan-y"></model-viewer>';
                    planet_html += '</div>';
                    planet_html += '<div class="card col-sm" planet_info>';
                        planet_html += '<h1>' + planet.name + '</h1>';
                        planet_html += '<p>Mass: ' + planet.mass + ' kg</p>';
                        planet_html += '<p>Radius: ' + planet.radius + ' km</p>';
                        planet_html += '<p>Semi Major Axis: ' + planet.semi_major_axis + ' AU</p>';
                        planet_html += '<p>Perihelion: ' + planet.perihelion + ' AU</p>';
                        planet_html += '<p>Aphelion: ' + planet.aphelion + ' AU</p>';
                        planet_html += '<p>Orbital Period: ' + planet.orbital_period + '</p>';
                        planet_html += '<p>Rotation Period: ' + planet.rotation_period + '</p>';
                        planet_html += '<p>Axial Tilt: ' + planet.axial_tilt + ' degrees</p>';
                        planet_html += '<p>Temperature: ' + planet.temperature + ' K</p>';
                        planet_html += '<p>Surface Gravity: ' + planet.surface_gravity + ' m/s^2</p>';
                        planet_html += '<p>Composition: ' + planet.composition + '</p>';
                        planet_html += '<p>Moons: ' + planet.moons + '</p>';
                        planet_html += '<p>Sub Moons: ' + planet.sub_moons + '</p>';
                    planet_html += '</div>';
                planet_html += '</div>';
            planet_html += '</div>';
        planet_div.innerHTML += planet_html;
    
    }
}

fetch('https://jlefevre559.github.io/system_project/system.json')
    .then(response => response.json())
    .then(data => {
        planet_data_json = JSON.stringify(data);

        var planets = read_planet_data(planet_data_json);
        add_planets_to_html(planets);
    });

