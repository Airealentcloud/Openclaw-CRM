# PATHWAYPIS WORDPRESS API FINDINGS - March 9, 2026

## TEST RESULTS:

### ✅ WORKING:
1. **GET /wp-json/** - API root accessible
2. **GET /wp/v2/posts?per_page=X** - List posts works
3. **POST /wp/v2/posts** - Create new posts works (Article 4 proof)

### ❌ NOT WORKING / ISSUES:
1. **GET /wp/v2/posts/{ID}** - Returns 404 with HTML (not JSON)
2. **POST /wp/v2/posts/{ID}** - Likely has same issue (untested)
3. **Response parsing** - WordPress returns HTML instead of JSON for some endpoints

## OBSERVATIONS:
- Article 4 (Post ID: 1582) was created successfully via API
- But individual GET by ID returns 404 with HTML response
- This suggests WordPress REST API has configuration issues
- May be security plugin blocking certain endpoints
- Or WordPress permalink/rest endpoint configuration issue

## IMPLICATIONS FOR PATHWAYPIS WORK:

### SAFE TO DO VIA API:
1. **Create new posts** (Article 4 proved this works)
2. **List existing posts** (for content audit)

### RISKY / UNTESTED VIA API:
1. **Update existing posts** (might fail or delete content)
2. **Delete posts** (definitely risky)

### RECOMMENDED APPROACH:
1. **For new articles:** Use API (proven to work)
2. **For updating existing articles:** Use manual WordPress admin
3. **For fixing duplicate content:** Manual updates recommended

## NEXT STEPS TESTING:
1. Try WordPress admin login with credentials
2. Test manual content updates
3. If API updates needed, test on draft post first
4. Consider asking web host about REST API configuration