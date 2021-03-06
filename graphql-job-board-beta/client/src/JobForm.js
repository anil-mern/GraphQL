import React, { Component } from 'react';
import { getAccessToken, isLoggedIn } from './auth';

export class JobForm extends Component {
  constructor(props) {
    super(props);
    this.state = {title: '', description: ''};
  }

  handleChange(event) {
    const {name, value} = event.target;
    this.setState({[name]: value});
  }

  async postJob(jobData) {
    const headers = {
      'Content-Type': 'application/json'
    };
    if (isLoggedIn()) {
      headers['authorization'] = "Bearer " + getAccessToken();
    }
    let job = await fetch("http://localhost:9000/graphql", {
      method: 'POST',
      headers,
      body: JSON.stringify({
        "operationName": null,
        "variables": {"input" : jobData},
        "query": `
          mutation createJob($input: CreateJobInput) {
            createJobSmart(input: $input) {
              id
              title
              company {
                name
              }
            }
          }
        `
      })
    });

    job = await job.json();
    return job.data.createJobSmart;
  }

  async handleClick(event) {
    event.preventDefault();
    console.log('should post a new job:', this.state);
    let res = await this.postJob({...this.state});
    console.log("res", res)
    this.props.history.push(`/jobs/${res.id}`);
  }

  render() {
    const {title, description} = this.state;
    return (
      <div>
        <h1 className="title">New Job</h1>
        <div className="box">
          <form>
            <div className="field">
              <label className="label">Title</label>
              <div className="control">
                <input className="input" type="text" name="title" value={title}
                  onChange={this.handleChange.bind(this)} />
              </div>
            </div>
            <div className="field">
              <label className="label">Description</label>
              <div className="control">
                <textarea className="input" style={{height: '10em'}}
                  name="description" value={description} onChange={this.handleChange.bind(this)} />
              </div>
            </div>
            <div className="field">
              <div className="control">
                <button className="button is-link" onClick={this.handleClick.bind(this)}>Submit</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
