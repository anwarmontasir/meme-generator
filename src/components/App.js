import React, { Component } from 'react';
import faker from 'faker';
import cowsay from 'cowsay-browser';
import dom2image from 'dom-to-image';
import fileSaver from 'file-saver';
import './app.css';

export default class App extends Component {
    
  constructor() {
    super();

    this.state = {
      content: 'Hello. Pick a cow! Or generate fake data',
      cows: [],
      current: 'cow'
    };

    this.handleCowChange = this.handleCowChange.bind(this);
    this.handleFakeData = this.handleFakeData.bind(this);
    this.handleBackground = this.handleBackground.bind(this);
    this.handleExport = this.handleExport.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
  }
  componentDidMount() {
    cowsay.list((err, cows) => {
      this.setState({ cows });
    });
  }

  handleCowChange({ target }) {
    this.setState({
      current: target.value || 'cow'
    });
  }

  handleFakeData() {
    this.setState({
      content: faker.random.words(4)
    });
  }

  handleBackground({ target }) {
    this.setState({
      background: target.value
    });
  }

  handleExport() {
    dom2image.toBlob(this.section).then(blob => {
      fileSaver.saveAs(blob, 'cute-cowsay.png');
    });
  }

  handleUpload({ target }) {
    const reader = new FileReader();

    reader.readAsDataURL(target.files[0]);

    reader.onload = () => {
      this.setState({ background: reader.result });
    };
  }

  render() {
    const { background, content, cows, current } = this.state;

    const cowSaid = cowsay.say({
      text: content,
      f: current
    });

    return (
      <div className="app">
          
        <header>
          <h1 className="App-title">Generate Cowsay Lorem</h1>
        </header>

        <main>

          <p>
            <label>
            Choose a Cow:
              <select onChange={this.handleCowChange}>
                <option value="">choose a cow</option>
                {cows.map((cow, index) => (
                  <option value={cow} key={index}>{cow}</option>
                ))}
              </select>
            </label>

            <label>
            Fake Ipsum: <button onClick={this.handleFakeData}>Generate</button>
            </label>

            <label>
            Background:
              <input name="url" onChange={this.handleBackground} />
              <input name="file" onChange={this.handleUpload} />
            </label>
          </p>

          <section 
            className="ipsum"
            ref={node => this.section = node}
            style={{
              backgroundImage: background ? `url(${background})` : null
            }}
          >
            <pre>{cowSaid}</pre>
          </section>

          <section>
            <button onClick={this.handleExport}>Export</button>
          </section>

        </main>

        <footer><small>&copy; 2018 this site</small></footer>

      </div>
    );
  }
}