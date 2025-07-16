class PeerService {
  private _peer?: RTCPeerConnection;

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
    if (this._peer) {
      const offer = await this._peer.createOffer();
      await this._peer.setLocalDescription(new RTCSessionDescription(offer));
      return offer;
    }
  }

  async setRemoteDescription(ans: RTCSessionDescriptionInit) {
    if (this._peer) {
      await this._peer.setRemoteDescription(new RTCSessionDescription(ans));
    }
  }
}

export default new PeerService();
