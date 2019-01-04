import '../assets/styles/footer.styl'

export default {
  data() {
    return {
      author: 'Vue\'s learner'
    }
  },
  render() {
    const footerStyle = {
      width: '100%',
      lineHeight: '100px',
      color: '#fff',
      background: '#4a4a4a',
      position: 'fixed',
      bottom: '0',
      left: '0',
      textAlign: 'center',
    }
    return (
      <div id="footer" style={footerStyle}>
        <p>Hey Shinvey, Jenkins runs as your expected, you did it!</p>
        <p>Written by {this.author}</p>
      </div>
    )
  }
}
