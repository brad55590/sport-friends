using FastEndpoints;
using SportFriends.Features.Authentication.Repositories;
using SportFriends.Shared.DTOs;

namespace SportFriends.Features.Authentication.Endpoints;

/// <summary>
/// GET /sports - Get all sports
/// </summary>
public class GetSportsEndpoint : Endpoint<EmptyRequest, ApiResponse<List<SportsListResponse>>>
{
    private readonly ISportsRepository _sportsRepository;

    public GetSportsEndpoint(ISportsRepository sportsRepository)
    {
        _sportsRepository = sportsRepository;
    }

    public override void Configure()
    {
        Get("/sports");
        AllowAnonymous();
    }

    public override async Task HandleAsync(EmptyRequest _, CancellationToken cancellationToken)
    {
        var sports = await _sportsRepository.GetAllSportsAsync();

        var response = ApiResponse<List<SportsListResponse>>.Success(
            data: sports.ToList(),
            meta: new ResponseMeta { Timestamp = DateTime.UtcNow },
            links: new Dictionary<string, string> { { "self", "/api/v1/sports" } }
        );

        await Send.OkAsync(response);
    }
}

/// <summary>
/// GET /sports/search - Search sports by name
/// </summary>
public class SearchSportsEndpoint : Endpoint<SearchSportsRequest, ApiResponse<List<SportsListResponse>>>
{
    private readonly ISportsRepository _sportsRepository;

    public SearchSportsEndpoint(ISportsRepository sportsRepository)
    {
        _sportsRepository = sportsRepository;
    }

    public override void Configure()
    {
        Get("/sports/search");
        AllowAnonymous();
    }

    public override async Task HandleAsync(SearchSportsRequest request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.Query))
        {
            await Send.OkAsync(
                ApiResponse<List<SportsListResponse>>.Success(
                    data: new List<SportsListResponse>(),
                    meta: new ResponseMeta { Timestamp = DateTime.UtcNow },
                    links: new Dictionary<string, string> { { "self", "/api/v1/sports/search" } }
                )
            );
            return;
        }

        var sports = await _sportsRepository.SearchSportsAsync(request.Query);

        var response = ApiResponse<List<SportsListResponse>>.Success(
            data: sports.ToList(),
            meta: new ResponseMeta { Timestamp = DateTime.UtcNow },
            links: new Dictionary<string, string> { { "self", "/api/v1/sports/search" } }
        );

        await Send.OkAsync(response);    }
}

/// <summary>
/// Request for searching sports
/// </summary>
public class SearchSportsRequest
{
    /// <summary>
    /// Search query
    /// </summary>
    public string? Query { get; set; }
}