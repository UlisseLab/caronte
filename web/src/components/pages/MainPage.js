/*
 * This file is part of caronte (https://github.com/eciavatta/caronte).
 * Copyright (c) 2020 Emiliano Ciavatta.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, version 3.
 *
 * This program is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {ReflexContainer, ReflexElement, ReflexSplitter} from 'react-reflex';
import 'react-reflex/styles.css';
import {Route, Routes} from 'react-router-dom';
import Filters from '../dialogs/Filters';
import Header from '../Header';
import CapturePane from '../panels/CapturePane';
import Connections from '../panels/ConnectionsPane';
import MainPane from '../panels/MainPane';
import PcapsPane from '../panels/PcapsPane';
import RulesPane from '../panels/RulesPane';
import SearchPane from '../panels/SearchPane';
import ServicesPane from '../panels/ServicesPane';
import StatsPane from '../panels/StatsPane';
import StreamsPane from '../panels/StreamsPane';
import StatusBar from '../StatusBar';
import Timeline from '../Timeline';
import './MainPage.scss';

const statusBarHeight = 25;

class MainPage extends Component {
  state = {
    timelineHeight: 210,
  };

  static get propTypes() {
    return {
      version: PropTypes.string,
    };
  }

  handleTimelineResize = (e) => {
    if (this.timelineTimeoutHandle) {
      clearTimeout(this.timelineTimeoutHandle);
    }

    this.timelineTimeoutHandle = setTimeout(() => this.setState({timelineHeight: e.domElement.clientHeight}), 100);
  };

  render() {
    let modal;
    if (this.state.filterWindowOpen) {
      modal = <Filters onHide={() => this.setState({filterWindowOpen: false})} />;
    }

    return (
      <ReflexContainer orientation="horizontal" className="page main-page">
        <div className="fuck-css">
          <ReflexElement className="page-header">
            <Header onOpenFilters={() => this.setState({filterWindowOpen: true})} configured={true} />
            {modal}
          </ReflexElement>
        </div>

        <ReflexElement className="page-content" flex={1}>
          <ReflexContainer orientation="vertical" className="page-content">
            <ReflexElement className="pane connections-pane" flex={0.5}>
              <Connections onSelected={(c) => this.setState({selectedConnection: c})} />
            </ReflexElement>

            <ReflexSplitter />

            <ReflexElement className="pane details-pane" flex={0.5}>
              <Routes>
                <Route path="/searches" element={<SearchPane />} />
                <Route path="/pcaps" element={<PcapsPane />} />
                <Route path="/rules" element={<RulesPane />} />
                <Route path="/services" element={<ServicesPane />} />
                <Route path="/stats" element={<StatsPane />} />
                <Route path="/capture" element={<CapturePane />} />
                <Route path="/connections/:id" element={<StreamsPane connection={this.state.selectedConnection} />} />
                <Route path="/" element={<MainPane version={this.props.version} />} />
              </Routes>
            </ReflexElement>
          </ReflexContainer>
        </ReflexElement>

        <ReflexSplitter propagate={true} />

        <ReflexElement className="page-footer" onResize={this.handleTimelineResize}>
          <Timeline height={this.state.timelineHeight - statusBarHeight} />
          <StatusBar class="page-status-bar" />
        </ReflexElement>
      </ReflexContainer>
    );
  }
}

export default MainPage;
