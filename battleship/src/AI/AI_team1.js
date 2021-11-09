const randomness = 3

function tryShip(playerState, ship, position, direction, propertyToTest) {
    var check_position = playerState.positions[position]
    var flag = true

    for (var i = 1; i <= ship.length; i++) {
        if (!check_position || check_position[propertyToTest]) {
            flag = false;
            break;
        }
        check_position = check_position[direction]
    }

    return flag
}

export const AI = () => {
    var max = 0
    var max_position
    var table = document.getElementById('gurumi')
    var cells = table.getElementsByClassName('image1')
    var positions = Array.from(table.getElementsByClassName('gurumi image2'))
    positions.forEach((position, index) => {
        if (max < parseInt(position.innerHTML)) {
            max = parseInt(position.innerHTML)
            max_position = index
        }
    })

    if (max_position) {
        cells[max_position].click()
        // console.log(document.getElementById(max_position))
        console.log(max_position)
    }
}

export function calculateDensity(playerState) {
    var current_position
    var directions = { 'w': null, 'n': null, 'e': null, 's': null };
    for (var i = 0; i < 100; i++) {
        playerState.positions[i].probability = 0
    }
    for (var shipName in playerState.ships) {
        var ship = playerState.ships[shipName]
        if (ship.alive) {
            for (var i = 0; i < 100; i++) {
                if (tryShip(playerState, ship, i, 'e', 'fired')) {
                    current_position = playerState.positions[i]
                    for (var j = 0; j < ship.length; j++) {
                        current_position.probability++
                        current_position = current_position['e']
                    }
                }
                if (tryShip(playerState, ship, i, 's', 'fired')) {
                    current_position = playerState.positions[i]
                    for (var j = 0; j < ship.length; j++) {
                        current_position.probability++
                        current_position = current_position['s']
                    }
                }
            }
        }
    }

    for (var i = 0; i < 100; i++) {
        if (playerState.positions[i].probability > 0) {
            playerState.positions[i].probability += Math.floor(Math.random() * randomness)
        }

        if (playerState.positions[i].fired) {
            if (playerState.positions[i].hit && !playerState.positions[i].sunk) {

                for (var direction in directions) {
                    var hitStreak = 1
                    var checked_position = playerState.positions[i]
                    while (checked_position[direction] && checked_position[direction].hit && !checked_position[direction].sunk) {
                        hitStreak++
                        console.log('Hitstreak now is ' + String(hitStreak))
                        checked_position = checked_position[direction]
                    }
                    checked_position = checked_position[direction]
                    if (checked_position && !checked_position.fired) {
                        checked_position.probability += hitStreak * 100
                        console.log(checked_position.index + ' is increase for ' + String(hitStreak * 100))
                    }
                }
            }
            playerState.positions[i].probability = -1
        }
    }
}