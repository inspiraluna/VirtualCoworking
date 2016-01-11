api_key=45454102
api_secret=fd2911e46c0a1c02d7f0664222169195c7eb146f
session_id=2_MX40NTQ1NDEwMn41LjkuMTU0LjIyNn4xNDUyNDI0OTgxNTM5fnZHTkRoR0F4S1Fqbyt6L3lmVGpGZ3BuV35-
curl \
     -i \
     -H "Content-Type: application/json" \
     -X GET -H "X-TB-PARTNER-AUTH:$api_key:$api_secret"  \
     https://api.opentok.com/v2/partner/$api_key/archive
