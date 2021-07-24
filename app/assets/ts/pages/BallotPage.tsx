import React, { FC, useState, useEffect } from "react";
import { Proposal } from "../models/proposal";
import Ballot from "../lib/ballot";

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
            <button className="btn btn-default btn-vote" type="button" data-id={ proposal.id }>
              Vote
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const AddressRegister: FC = () => {
  const [addresses, setAddresses] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      try {
        setAddresses(await Ballot.getInstance().then((b) => b.listAddresses()));
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  return (
    <div className="container">
      <div className="row" id="address-div">
        <div style={{ marginLeft: "1rem", marginTop: "2rem" }}>
          <span>Address : </span>
          <select id="enter-address" defaultValue="">
            { addresses.map((a) => <AddressOption key={ a } address={ a } />) }
          </select>
        </div>
      </div>
      <button className="btn btn-info" type="button" id="register">
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

const BallotPage: FC = () => {
  const [isChairperson, setIsChairperson] = useState<boolean>(false);
  const [proposals, setProposals] = useState<Proposal[]>([]);

  useEffect(() => {
    (async () => {
      try {
        setProposals(await Ballot.fetchProposals());
        setIsChairperson(await Ballot.getInstance().then((b) => b.isChairperson()));
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  return (
    <div>
      <Proposals proposals={ proposals } />
      { isChairperson && <AddressRegister /> }
      <div className="container">
        <button className="btn btn-success" type="button" id="win-count">
          Declare Winner
        </button>
      </div>
    </div>
  );
};

export default BallotPage;
