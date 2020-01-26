import React, { Component, useCallback, useState } from "react";
import {
  Button,
  Card,
  ButtonGroup,
  TextContainer,
  Form,
  FormLayout,
  TextField
} from "@shopify/polaris";
import axios from "axios";
import { text, userLang } from "../i18n";
import * as helpers from "../helpers";

export default class Settings extends Component {
  constructor(args) {
    super(args);
    this.gVars = args.gVars;
    this.state = this.gVars.settings || {
      email: "",
      yourName: "",
      authorized: false,
      loading: false,
      authorizing: false,
      updating: false,
      singingOut: false
    };
  }

  componentDidMount() {
    this.getSettings();
  }

  componentWillUnmount() {}

  setLoading(value) {
    this.setState({
      loading: value
    });
  }
  setAuthorizing(value) {
    this.setState({
      authorizing: value
    });
    this.setLoading(value);
  }
  setUpdating(value) {
    this.setState({
      updating: value
    });
    this.setLoading(value);
  }
  setSingingOut(value) {
    this.setState({
      singingOut: value
    });
    this.setLoading(value);
  }

  updateAppState() {
    this.props.setSettings(this.state);
  }

  getSettingsData() {
    const self = this;
    return {
      yourName: self.state.yourName,
      email: self.state.email,
      authorized: self.state.authorized
    };
  }

  getSettings() {
    const self = this;
    self.setLoading(true);
    axios
      .get(helpers.getURL("/settings/" + self.gVars._id))
      .then(response => {
        if (response.data && response.data.rows && response.data.rows.length) {
          self.setState(response.data.rows[0], () => {
            self.updateAppState();
          });
        } else {
          alert(text("error_getting_settings"));
        }
        self.setLoading(false);
      })
      .catch(err => {
        console.log(err);
        self.setLoading(false);
        return null;
      });
  }

  authorize() {
    const self = this;
    self.setAuthorizing(true);

    // TODO: set true when it is ok the auth process
    self.setState(
      {
        email: self.state.email,
        authorized: true
      },
      () => {
        axios
          .post(helpers.getURL("/settings/ae-login"), self.getSettingsData())
          .then(response => {
            self.updateAppState();
            self.setAuthorizing(false);
          })
          .catch(err => {
            console.log(err);
            self.setAuthorizing(false);
            return null;
          });
      }
    );
  }

  updateSettings() {
    const self = this;
    self.setUpdating(true);
    axios
      .put(
        helpers.getURL("/settings/" + self.gVars._id),
        self.getSettingsData()
      )
      .then(response => {
        self.updateAppState();
        self.setUpdating(false);
      })
      .catch(err => {
        console.log(err);
        self.setUpdating(false);
        return null;
      });
  }

  signOut() {
    const self = this;
    self.setSingingOut(true);
    self.setState(
      {
        authorized: false
      },
      () => {
        axios
          .put(
            helpers.getURL("/settings/" + self.gVars._id),
            self.getSettingsData()
          )
          .then(response => {
            self.updateAppState();
            self.setSingingOut(false);
            location.reload();
          })
          .catch(err => {
            console.log(err);
            self.setSingingOut(false);
            return null;
          });
      }
    );
  }

  handleChangeValue(value, key) {
    const obj = {};
    obj[key] = value;
    this.setState(obj);
  }

  render() {
    return (
      <Card
        key="settings_card"
        title={this.state.authorized ? text("settings") : text("lets_auth")}
        sectioned
      >
        {!this.state.authorized ? (
          <Card.Section key="settings_text">
            <TextContainer>{text("settings_text")}</TextContainer>
          </Card.Section>
        ) : (
          ""
        )}

        <Card.Section>
          <Form>
            <FormLayout>
              <TextField
                key="email-field"
                value={this.state.email}
                onChange={newValue => this.setState({ email: newValue })}
                label={text("email")}
                type="email"
                disabled={this.state.loading || this.state.authorized}
                helpText={
                  !this.state.authorized ? (
                    <span>{text("your_Shopify_email")}</span>
                  ) : (
                    ""
                  )
                }
              />
              {this.state.authorized ? (
                <div key="settings-form">
                  <TextField
                    key="your-name-field"
                    value={this.state.yourName}
                    onChange={newValue => this.setState({ yourName: newValue })}
                    label={text("whats_your_name")}
                    type="email"
                    disabled={this.state.loading}
                    helpText={<span>{text("tell_me_your_name")}</span>}
                  />
                </div>
              ) : (
                ""
              )}
            </FormLayout>
          </Form>
        </Card.Section>
        <Card.Section>
          {this.state.authorized ? (
            <div key="authorized-div">
              <ButtonGroup>
                <Button
                  key="update-settings-button"
                  loading={this.state.loading}
                  onClick={() => this.updateSettings()}
                  disabled={this.state.loading}
                >
                  {text("update")}
                </Button>
                <Button
                  key="singingout-button"
                  loading={this.state.singingOut}
                  disabled={this.state.loading}
                  destructive
                  onClick={() => this.signOut()}
                >
                  {text("sign_out")}
                </Button>
              </ButtonGroup>
            </div>
          ) : (
            <Button
              key="authorize-button"
              loading={this.state.authorizing}
              onClick={() => this.authorize()}
              disabled={!this.state.email}
            >
              {text("authorize")}
            </Button>
          )}
        </Card.Section>
      </Card>
    );
  }
}
