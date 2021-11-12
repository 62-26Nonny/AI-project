export function AI2(playerState) {
    var pos
    var max = 0
    var max_position
    var table = document.getElementById('gurumi')
    var cells = table.getElementsByClassName('image1')

    // Pick the cell with highest prob
    for(var i = 0; i < 100; i++) {
        if (max < playerState.positions[i].probability) {
            max = playerState.positions[i].probability
            max_position = i
        }
    }

    // If there is no such cell
    if(max === 0)
    {
        // Randomly pick one
        do {
            pos = Math.floor(Math.random() * 100)
        } while (playerState.positions[pos].fired)
        max_position = pos
    }

    if(max_position >= 0) {
        cells[max_position].click()
    }

    if(playerState.positions[max_position].fired || playerState.positions[max_position].hit)
    {
        playerState.positions[max_position].probability = -1
        calculateNextPos(playerState, max_position)
    }
}

function calculateNextPos(playerState, current_position) {
    var randomness = 2
    var directions = { 'w': null, 'n': null, 'e': null, 's': null };
    var oppositeDirection
    var currentCell = playerState.positions[current_position]

    // If click on ship
    if(currentCell.hit) {
        // Calculate adjacent cell's probability
        for(var direction in directions) {
            var adjacent = currentCell[direction]
            var streak = 1

            switch(direction)
            {
                case 'w':
                    oppositeDirection = 'e'
                    break
                case 'e':
                    oppositeDirection = 'w'
                    break
                case 'n':
                    oppositeDirection = 's'
                    break
                case 's':
                    oppositeDirection = 'n'
                    break
            }

            // If the adjacent cell has never been picked
            if(adjacent && adjacent.probability >= 0){
                /*
                Check the next 2 cells with same alignment
                    → If both of them is hit but still not sunk 
                        → likely to be the same ship
                            → should pick in the same alignment → more likely to hit
                                → give more probability to adjacent cell

                  [ ] [ ] [ ]
                  [X] [X] [ ] ← Should pick here
                  [ ] [ ] [ ]
                
                */ 
                var checker1 = adjacent[oppositeDirection]
                var checker2 = checker1[oppositeDirection]
                if(checker1){
                    while(checker1 && checker1.hit && !checker1.sunk && checker2 && checker2.hit && !checker2.sunk){
                        streak += 1
                        checker1 = checker1[oppositeDirection]
                        checker2 = checker2[oppositeDirection]
                    }
                }

                var random = Math.floor(50 * (Math.random() * (randomness - 1) + 1))
                adjacent.probability += streak * random
            }
            // If the adjacent cell is out of map and the next 2 cell with same alignment is hit and not sunk, the next pick should be the first unpicked cell on the opposite side
            else if(adjacent === null)
            {
                var checker1 = currentCell
                var checker2 = checker1[oppositeDirection]
                if(checker1){
                    while(checker1 && checker1.hit && !checker1.sunk && checker2 && checker2.hit && !checker2.sunk){
                        streak += 1
                        checker1 = checker1[oppositeDirection]
                        checker2 = checker2[oppositeDirection]
                    }
                }
                if(checker2)
                {
                    checker2.probability *= streak
                }
            }
        }
    }

    // If not click on ship
    else if(currentCell.fired)
    {
        for(var direction in directions)
        {
            var adjacent = currentCell[direction]
            var streak = 1

            switch(direction)
            {
                case 'w':
                    oppositeDirection = 'e'
                    break
                case 'e':
                    oppositeDirection = 'w'
                    break
                case 'n':
                    oppositeDirection = 's'
                    break
                case 's':
                    oppositeDirection = 'n'
                    break
            }

            /*
            If adjacent cell is not sunk
                → the other part of the ship must be on the other side
                    -> give the other side unpicked cell (that isn't out of the map) the highest probability

                                       [ ] [ ] [ ] [ ]
                 Ship should be here → [ ] [X] [X] [M] ← Miss the ship here
                                       [ ] [ ] [ ] [ ]
            */
            if (adjacent && adjacent.hit && !adjacent.sunk)
            {
                var checker1 = adjacent
                while(checker1 && checker1.hit && !checker1.sunk)
                {
                    streak += 1
                    checker1 = checker1[direction]
                }
                if(checker1 && checker1 >= 0)
                {
                    checker1.probability *= streak
                }
            }
            /*
            But if it sunk
                -> We should try pick randomly more than pick next to the sunk ship because the ship more likely to spread out more than stick together
            */
            else if(currentCell[direction] && currentCell[direction].sunk && currentCell[oppositeDirection] && (!currentCell[oppositeDirection].fired || !currentCell[oppositeDirection].hit))
            {
                for(var i = 0; i < 100; i++){
                    if(playerState.positions[i].probability > 0)
                    {
                        playerState.positions[i].probability = 0
                    }
                }
            }
        }
    }

    console.log("")
}

