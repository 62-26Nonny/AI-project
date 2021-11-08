
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