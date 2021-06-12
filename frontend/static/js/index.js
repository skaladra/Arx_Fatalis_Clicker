window.onload = function () {
    setAutoClick()
    set_all_boosts_availability()
}

function setAutoClick() {
    setInterval(function() {
        const power_node = document.getElementById('auto_click_power')
        const power = parseInt(power_node.innerText)
        const click_counter_node = document.getElementById('counter')
        const click_count = parseInt(click_counter_node.innerText)

        click_counter_node.innerText = click_count + power
    }, 1000)
}

function call_click() {
    click_image()

    fetch('/api/call_click/', {
        method: 'GET'
    }).then(response => {
        if (response.ok) return response.json()
        else return Promise.reject(response)
    }).then(data => {
        const counter = document.getElementById('counter')
        counter.innerText = data.maincycle.click_count

        if (data.boosts) {
            update_boosts(data.boosts)
        }
        set_all_boosts_availability()
    }).catch(err => console.log(err))
}

function click_image() {
    image = document.getElementById('click-img')
    image.style.cssText = 'transform: scale(0.95);'
    setTimeout(function() {
        image.style.cssText = ''
    }, 50)
}


function buy_boost(boost_id) {
    const csrftoken = getCookie('csrftoken')

    fetch(`/api/buy_boost/`, {
        method: 'POST',
        headers: {
            "X-CSRFToken": csrftoken,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            boost_id: boost_id
        })
    }).then(response => {
        if (response.ok) return response.json()
        else return Promise.reject(response)
    }).then(data => {
        const click_count = document.getElementById('counter')
        const power = document.getElementById('click_power')
        const auto_power = document.getElementById('auto_click_power')

        click_count.innerText = data.maincycle.click_count
        power.innerText = data.maincycle.click_power
        auto_power.innerText = data.maincycle.auto_click_power

        update_boosts(data.boosts)
        set_all_boosts_availability()

    }).catch(err => console.log(err))
}


function update_boosts(boosts) {
    let boosts_holder = document.getElementById('boosts-holder')
    boosts_holder.innerHTML = ''

    boosts.forEach(boost => {
        add_boost(boosts_holder, boost)
    })
}

function add_boost(parent, boost) {
    const button = document.createElement('button')
    button.setAttribute('class', 'boost')
    if (boost.boost_type == 1)  button.setAttribute('class', 'boost auto')

    button.setAttribute('id', `boost_${boost.id}`)
    button.setAttribute('onclick', `buy_boost(${boost.id})`)
    button.innerHTML = `
        <p>lvl: ${boost.level}</p>
        <p>+<span id="boost_power">${boost.power}</span></p>
        <p><span id="boost_price">${boost.price}</span></p>
    `
    
    parent.appendChild(button)
}

function set_all_boosts_availability() {
    const counter = document.getElementById('counter')
    const boosts = document.getElementsByClassName('boost')

    for (let boost of boosts) {
        set_boost_availability(counter.innerText, boost)
    }
}

function set_boost_availability(coins, boost) {
    const price = boost.querySelector("#boost_price").innerHTML
    if (parseInt(price) > parseInt(coins)) {
        boost.setAttribute('disabled', 'true')
    } else {
        boost.removeAttribute('disabled')
    }
}


function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}