from flask import Flask, jsonify, request
import requests
import os


app = Flask(__name__)


@app.route('/health', methods=['GET'])
def health_check():
    """Simple health check route."""
    return jsonify({
        "status": "ok",
        "service": "Arogyabhashini Flask Backend",
        "env": os.getenv("APP_ENV", "development")
    }), 200


@app.route('/test_asr', methods=['POST'])
def test_asr():
    """
    Test Bhashini ASR API connectivity.
    Send a short WAV audio (<20s, <5MB) to verify token and endpoint.
    """
    try:
        # Load environment variables
        BHASHINI_ASR_URL = "https://canvas.iiit.ac.in/sandboxbeprod/infer_asr/67127dcbb1a6984f0c5e7d35"
        BHASHINI_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjhlYTcwNDBiOTNlM2JlYzkwMWZkYTkzIiwicm9sZSI6Im1lZ2F0aG9uX3N0dWRlbnQifQ.S8rRvOMxOd7EROKdBrKTzZhwYZ4vhPVpJgfVVCr4FTU"

        # Ensure both keys are set
        if not BHASHINI_ASR_URL or not BHASHINI_TOKEN:
            return jsonify({"error": "Bhashini URL or Token not set"}), 400

        # Check if file was uploaded
        if 'audio_file' not in request.files:
            return jsonify({"error": "Please upload an audio file (wav)"}), 400

        audio_file = request.files['audio_file']

        # Send to Bhashini ASR API
        headers = {"access-token": BHASHINI_TOKEN}
        files = {"audio_file": (audio_file.filename, audio_file.stream, audio_file.mimetype)}

        response = requests.post(BHASHINI_ASR_URL, headers=headers, files=files)

        # Return the API response
        return jsonify(response.json()), response.status_code

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    # Run Flask dev server
    app.run(host='0.0.0.0', port=8000, debug=True)
