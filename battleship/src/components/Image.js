import PropTypes from 'prop-types'

const Image = (props) => {
    return (
        <td key={props.key}>
            <img id={props.key} src={props.src} />
        </td>
    )
}

Image.propTypes = {
    src: PropTypes.string,
}

export default Image
