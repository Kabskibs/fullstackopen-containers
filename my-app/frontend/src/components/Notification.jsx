import PropTypes from 'prop-types'

const Notification = ({ message, state }) => {
  if (message === null) {
    return null
  }
  if (state === 0) {
    return (
      <div className='notificationSuccess'>
        {message}
      </div>
    )
  } else {
    return (
      <div className='notificationError'>
        {message}
      </div>
    )
  }
}

Notification.propTypes = {
  message: PropTypes.string,
  state: PropTypes.number.isRequired
}

export default Notification