import React, { FC, useState, useEffect } from "react";
import { Proposal } from "../models/proposal";
import * as Ballot from "../lib/ballot";
import * as ReactHelper from "../lib/helper/react";

const Proposals: FC<{ proposals: Proposal[] }> = ({ proposals }) => {
  return (
    <div className="container">
      <div className="row">
        <div className="col-xs-12 col-sm-8 col-sm-push-2">
          <h1 className="text-center">Pick your Favourite</h1>
          <br/>
        </div>
      </div>
      <div id="proposals-row" className="row">
        { proposals.map((p) => <ProposalPanel key={ p.id } proposal={ p } />) }
      </div>
      <hr/>
    </div>
  );
}

const ProposalPanel: FC<{ proposal: Proposal }> = ({ proposal }) => {
  const [isRegistered] = ReactHelper.useLazyState(false, () => Ballot.isRegistered());

  return (
      <div className="col-sm-8 col-md-2 col-lg-3">
      <div className="panel panel-default panel-proposal">
        <div className="panel-heading">
          <h3 className="panel-title" style={{ textAlign: "center" }}>{ proposal.name }</h3>
        </div>
        <div className="panel-body">
          <img
            src={ proposal.picture }
            alt="140x140"
            data-src="holder.js/170x170"
            className="img-rounded img-center"
            style={{ width: "20rem", height: "24rem" }}
            data-holder-rendered="true"
          />
          <br/><br/>
          <div className="col-md-12 text-center">
            <button type="button" data-id={ proposal.id } disabled={ !isRegistered }>
              Vote
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const AddressRegister: FC = () => {
  const [addresses] = ReactHelper.useLazyState([], () => Ballot.listAddresses());
  const [targetAddress, setTargetAddress] = useState(addresses[0]);

  useEffect(() => {
    setTargetAddress(targetAddress || addresses[0]);
  }, [addresses]);

  const onClick = ReactHelper.useButtonClick(async () => {
    await Ballot.register(targetAddress);
  });

  return (
    <div className="container">
      <div style={{ marginLeft: "1rem", marginTop: "2rem" }}>
        <span>Address : </span>
        <select value={ targetAddress } onChange={ (e) => { setTargetAddress(e.target.value); } }>
          { addresses.map((a) => <AddressOption key={ a } address={ a } />) }
        </select>
      </div>
      <button type="button" onClick={ onClick }>
        Register
      </button>
      <br/>
      <hr/>
    </div>
  );
}

const AddressOption: FC<{ address: string }> = ({ address }) => {
  return <option value={ address }>{ address }</option>
}

const AdvancePhase: FC = () => {
  // TODO: update currentPhase based on an event from blockchain
  const [currentPhase, updateCurrentPhase] = ReactHelper.useLazyState(0, () => Ballot.currentPhase());
  const onClick = ReactHelper.useButtonClick(async () => {
    await Ballot.advancePhase();
    updateCurrentPhase();
  });

  return (
    <div className="container">
      <div style={{ marginLeft: "1rem", marginTop: "2rem", marginBottom: "2rem" }}>
        <span>Current Phase : { currentPhase }</span>
      </div>
      <button type="button" onClick={ onClick } >
        Advance State
      </button>
      <br/>
      <hr/>
    </div>
  );
}

const BallotPage: FC = () => {
  const [isChairperson] = ReactHelper.useLazyState(false, () => Ballot.isChairperson());
  const [proposals] = ReactHelper.useLazyState([], () => Ballot.fetchProposals());

  return (
    <div>
      <Proposals proposals={ proposals } />
      { isChairperson && <AddressRegister /> }
      { isChairperson && <AdvancePhase /> }
      <div className="container">
        <button type="button">
          Declare Winner
        </button>
      </div>
    </div>
  );
};

export default BallotPage;
