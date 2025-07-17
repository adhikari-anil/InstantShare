class PeerService {
  public _peer?: RTCPeerConnection;
  public dataChannel?: RTCDataChannel | null = null;
  public onDataChannel?: ((channel: RTCDataChannel) => void) | null = null;
  public isOfferCreated: boolean = false;

  constructor() {
    if (!this._peer) {
      this._peer = new RTCPeerConnection({
        iceServers: [
          {
            urls: "stun:stun.l.google.com:19302",
          },
        ],
      });
    }

    //For receiver-side data channel
    this._peer.ondatachannel = (event) => {
      this.dataChannel = event.channel;
      if (this.onDataChannel) {
        this.onDataChannel(event.channel);
      }
    };
  }

  public onIceCandidate(callback: (candidate: RTCIceCandidate) => void) {
    if (this._peer) {
      this._peer.onicecandidate = (e) => {
        if (e.candidate) {
          callback(e.candidate);
        }
      };
    }
  }

  public async addIceCandidate(candidate: RTCIceCandidate) {
    try {
      await this._peer?.addIceCandidate(candidate);
      console.log("Successfully added ICE candidate..");
    } catch (error) {
      console.log("Error Adding ICE candidate: ", error);
    }
  }

  async getAnswer(offer: RTCSessionDescriptionInit) {
    if (this._peer) {
      await this._peer.setRemoteDescription(offer);
      const answer = await this._peer.createAnswer();
      await this._peer.setLocalDescription(new RTCSessionDescription(answer));
      return answer;
    }
  }

  async getOffer() {
    if (!this._peer) return;
    if (this.isOfferCreated) {
      console.warn("Offer is already created...");
      return;
    }
    const offer = await this._peer.createOffer();
    await this._peer.setLocalDescription(new RTCSessionDescription(offer));
    return offer;
  }

  async setRemoteDescription(ans: RTCSessionDescriptionInit) {
    if (this._peer) {
      await this._peer.setRemoteDescription(new RTCSessionDescription(ans));
    }
  }
}

export default new PeerService();
