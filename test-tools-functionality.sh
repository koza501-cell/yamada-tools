#!/bin/bash
echo "=== CRITICAL TOOL FUNCTIONALITY TEST ==="

# Test 1: PDF Compress (most important)
echo "Test: PDF Compress API endpoint..."
curl -s http://192.168.1.32:8000/api/pdf/compress | grep -q "compress" && echo "✅ Backend ready" || echo "❌ Backend not responding"

# Test 2: Check if upload works
echo "Test: File upload capability..."
# Would need actual file to test

echo ""
echo "⚠️  MANUAL TESTING RECOMMENDED:"
echo "1. Upload a PDF to /pdf/compress"
echo "2. Upload an image to /image/resize"
echo "3. Create a document at /document/invoice"
echo "4. Test conversion at /convert/wareki-seireki"
echo "5. Test generator at /generator/hanko"
